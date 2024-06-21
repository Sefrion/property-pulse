import connectDB from '@/config/db';
import Message from '@/models/Message';
import { getSessionUser } from '@/utils/getSessionUser';

export const dynamic = 'force-dynamic';

// GET /api/messages
export const GET = async () => {
	try {
		await connectDB();

		const sessionUser = await getSessionUser();

		if (!sessionUser || !sessionUser.user) {
			return new Response(JSON.stringify({ msg: 'User ID is required' }), {
				status: 401
			});
		}

		const { userId } = sessionUser;

		const readMessages = await Message.find({ recipient: userId, read: true })
			.sort({ createdAt: -1 })
			.populate('sender', 'username')
			.populate('property', 'name');

		const unreadMessages = await Message.find({ recipient: userId, read: false })
			.sort({ createdAt: -1 })
			.populate('sender', 'username')
			.populate('property', 'name');

		const messages = [...unreadMessages, ...readMessages];

		return new Response(JSON.stringify(messages), { status: 200 });
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify({ msg: 'Something went wrong' }), {
			status: 200
		});
	}
};

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
