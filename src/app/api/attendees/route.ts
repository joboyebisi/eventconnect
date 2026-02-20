import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // We use the Service Role Key here to bypass RLS, allowing guest attendees to register 
        // without first creating a full Supabase Auth account.
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // We will assign a random user_id for the prototype so it satisfies the DB constraint
        const randomUUID = crypto.randomUUID();

        const { error } = await supabase
            .from('attendee_profiles')
            .insert({
                user_id: randomUUID,
                event_id: data.eventId,
                name: data.name,
                role: data.role,
                company: data.company,
                linkedin: data.linkedin,
                headshot_url: data.imageUrl
            });

        if (error) {
            console.error("Supabase insert error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
