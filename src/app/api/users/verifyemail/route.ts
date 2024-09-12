import { connect } from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'

connect()

export async function POST(request: NextRequest) {
    try {

        const reqBody = await request.json()
        const { token } = reqBody
        console.log("token:", token);

        if (!token) {
            return NextResponse.json({ error: "Not able to gather token" }, { status: 400 })
        }

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() }
        })

        if (!user) {
            return NextResponse.json({ error: "Not able to find user based on the token" }, { status: 400 })
        }

        console.log("User after verification of token", user);

        user.isVerified = true
        user.verifyToken = undefined
        user.verifyTokenExpiry = undefined

        await user.save()

        return NextResponse.json({
            message: "User Email VErified Successfully",
            success: true,
            user
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}