import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // Ensure user is an admin or MVP bypass
        // For now, any authenticated user can create an event
        const { data: event, error: insertError } = await supabase
            .from('events')
            .insert({
                title: body.title,
                slug: body.slug,
                date: body.date,
                location: body.location,
                aboutText: body.aboutText, // Ensure DB column matches 'aboutText' or convert to snake_case if we built Supabase that way
                image: body.image,
                frontPageHtml: body.frontPageHtml,
                admin_id: user.id
            })
            .select()
            .single();

        if (insertError) {
            throw new Error(insertError.message);
        }

        return NextResponse.json(event);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
