import connectDB from '@/config/db';
import Property from '@/models/Property';

// GET /api/properties
export const GET = async (request) => {
	try {
		await connectDB();

		const page = request.nextUrl.searchParams.get('page') || 1;
		const pageSize = request.nextUrl.searchParams.get('pageSize') || 6;

		const skip = (page - 1) * pageSize;

		const total = await Property.countDocuments({});
		const properties = await Property.find({}).skip(skip).limit(pageSize);

		const result = {
			total,
			properties
		};

		return new Response(JSON.stringify(result), {
			status: 200
		});
	} catch (error) {
		console.log(error);
		return new Response('Something Went Wrong', { status: 500 });
	}
};
