const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

// Fetch all properties
export async function fetchProperties({ showFeatured = false } = {}) {
	try {
		// Handle case when domain is not yet available
		if (!apiDomain) {
			return [];
		}
		const res = await fetch(
			`${apiDomain}/properties${showFeatured ? '/featured' : ''}`,
			{ cache: 'no-store' }
		);
		if (!res.ok) {
			throw new Error('Failed to fetch data');
		}
		return res.json();
	} catch (error) {
		console.log(error);
		return [];
	}
}

// Fetch single property
export async function fetchProperty(id) {
	try {
		// Handle case when domain is not yet available
		if (!apiDomain) {
			return null;
		}
		const res = await fetch(`${apiDomain}/properties/${id}`);
		if (!res.ok) {
			throw new Error('Failed to fetch data');
		}
		return res.json();
	} catch (error) {
		console.log(error);
		return null;
	}
}
