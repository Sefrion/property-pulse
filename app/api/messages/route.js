import connectDB from '@/config/db';
import Message from '@/models/Message';
import { getSessionUser } from '@/utils/getSessionUser';

export const dynamic = 'force-dynamic';

// POST /api/messages
export const POST = async (request) => {
	try {
		await connectDB();

		const { name, email, phone, message, property, recipient } =
			await request.json();

		const sessionUser = await getSessionUser();

		if (!sessionUser || !sessionUser.user) {
			return new Response(
				JSON.stringify({ msg: 'You must be logged in to send a message' }),
				{ status: 401 }
			);
		}

		const { user } = sessionUser;

		// Cannot send message to self
		if (user.id === recipient) {
			return new Response(
				JSON.stringify({ msg: 'Cannot send message to yourself' }),
				{ status: 400 }
			);
		}

		const newMessage = new Message({
			sender: user.id,
			recipient,
			property,
			body: message,
			email,
			phone,
			name
		});

		await newMessage.save();

		return new Response(JSON.stringify({ msg: 'Message was sent' }), {
			status: 200
		});
	} catch (error) {
		console.log(error);
		return new Response('Something went wrong', {
			status: 500
		});
	}
};
