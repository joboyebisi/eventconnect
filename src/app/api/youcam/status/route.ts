import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const task_id = searchParams.get('task_id');

        if (!task_id) {
            return NextResponse.json({ error: "No task_id provided" }, { status: 400 });
        }

        const apiKey = process.env.YOUCAM_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "No YOUCAM_API_KEY provided" }, { status: 500 });
        }

        const statusRes = await fetch(`https://yce-api-01.makeupar.com/s2s/v2.0/task/headshot/${task_id}`, {
            headers: { "Authorization": `Bearer ${apiKey}` }
        });

        const statusData = await statusRes.json();

        if (!statusRes.ok) {
            return NextResponse.json({ error: "Failed to check status", details: statusData }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            task_status: statusData.data.task_status,
            results: statusData.data.results,
            error: statusData.data.error,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
