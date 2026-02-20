import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
    try {
        const supabase = await createClient();
        const { data: events, error } = await supabase
            .from('events')
            .select(`
                *,
                attendee_profiles(*)
            `);

        if (error) {
            throw error;
        }

        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }
}
