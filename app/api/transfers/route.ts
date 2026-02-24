
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { transferSchema } from '../../../lib/validators'
import { proUserLimit, freeUserLimit } from '../../../lib/rate-limit'
import { transferQueue } from '../../../lib/queue/config'
import { extractFileKey } from '../../../services/figmaService'
import logger from '../../../lib/logger'

/**
 * GESTALTUNG TRANSFER ENDPOINT (PRODUCTION-READY)
 * Handles high-fidelity design porting requests with strict security audits.
 */
export async function POST(req: Request) {
  const startTime = Date.now()

  try {
    // 1. Authentication
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (!session) {
      logger.warn('Unauthorized transfer attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse and validate input
    const body = await req.json()
    const validatedData = transferSchema.parse(body)

    // 3. Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('monthly_transfers, transfer_limit, subscription_tier')
      .eq('id', session.user.id)
      .single()

    if (profileError || !profile) {
      logger.error({ error: profileError }, 'Failed to fetch profile')
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // 4. Rate limiting (Tier-aware)
    const limit = profile.subscription_tier === 'pro'
      ? proUserLimit
      : freeUserLimit

    const { success: rateLimitSuccess } = await (limit as any).limit(session.user.id)

    if (!rateLimitSuccess) {
      logger.warn({ userId: session.user.id }, 'Rate limit exceeded')
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    // 5. Check usage limits
    if (
      profile.subscription_tier === 'free' &&
      profile.monthly_transfers >= profile.transfer_limit
    ) {
      logger.info({ userId: session.user.id }, 'Transfer limit exceeded')
      return NextResponse.json(
        { error: 'Transfer limit exceeded. Please upgrade to Pro.' },
        { status: 403 }
      )
    }

    // 6. Extract and validate Figma file key
    const fileKey = extractFileKey(validatedData.figmaUrl)

    // 7. Create transfer record
    const { data: transfer, error: insertError } = await supabase
      .from('transfers')
      .insert({
        user_id: session.user.id,
        figma_file_url: validatedData.figmaUrl,
        figma_file_key: fileKey,
        status: 'queued',
        progress: 0,
        design_name: validatedData.projectName,
        include_animations: validatedData.includeAnimations,
        include_interactions: validatedData.includeInteractions,
        optimize_for_performance: validatedData.optimizePerformance,
        enable_market_research: validatedData.enableMarketResearch
      })
      .select()
      .single()

    if (insertError || !transfer) {
      logger.error({ error: insertError }, 'Failed to create transfer')
      return NextResponse.json(
        { error: 'Failed to create transfer' },
        { status: 500 }
      )
    }

    // 8. Queue background job (Step 8 Logic)
    await transferQueue.add(
      'process-transfer',
      {
        transferId: transfer.id,
        userId: session.user.id,
        figmaUrl: validatedData.figmaUrl,
        options: {
          includeAnimations: validatedData.includeAnimations,
          includeInteractions: validatedData.includeInteractions,
          optimizePerformance: validatedData.optimizePerformance
        }
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        },
        removeOnComplete: {
          age: 86400 // Keep completed jobs for 24 hours
        }
      }
    )

    // 9. Log success (Step 9 Logic)
    logger.info({
      userId: session.user.id,
      transferId: transfer.id,
      duration: Date.now() - startTime
    }, 'Transfer queued successfully')

    // 10. Return response (Step 10 Logic)
    return NextResponse.json({
      id: transfer.id,
      status: 'queued',
      message: 'Transfer queued successfully'
    }, {
      status: 202
    })

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: error.errors
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
