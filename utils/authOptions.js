import connectDB from '@/config/db';
import User from '@/models/User';

import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET_ID,
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code'
				}
			}
		})
	],
	callbacks: {
		// Invoked on successfull sign in
		async signIn({ profile }) {
			// 1. Connect to db
			await connectDB();
			// 2. Check if user already exist
			const userExists = await User.findOne({ email: profile.email });
			// 3. If not, then add user to db
			if (!userExists) {
				// Truncate username if too long
				const username = profile.name.slice(0, 20);
				await User.create({
					email: profile.email,
					username,
					image: profile.picture
				});
			}
			// 4. Return true to allow sign in
			return true;
		},
		// Modifies the session object
		async session({ session }) {
			// 1. Get user from db
			const user = await User.findOne({ email: session.user.email });
			// 2. Assign user id to the session
			session.user.id = user._id.toString();
			// 3. Return session
			return session;
		}
	}
};
