import { connect } from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import { getDataFromToken } from '@/helpers/getDataFromToken'



connect()

export async function POST(request: NextRequest) {
    try {

        const userId = await getDataFromToken(request);
        if(!userId){
            return NextResponse.json({ error: "token not found" }, { status: 500 })
        }

        console.log("userId from decoded Token", userId);

        const user = await User.findOne({ _id: userId }).select("-password")

        console.log("User After Decoded token", user);

        if (!user) {
            return NextResponse.json({ error: "User Not Found" })
        }

        return NextResponse.json({
            message: "User Found",
            data: user
        })




    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}
