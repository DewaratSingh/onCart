    import { NextResponse } from 'next/server';
    
    export async function GET(request) {
        return NextResponse.rewrite(new URL('/', request.url));
    }