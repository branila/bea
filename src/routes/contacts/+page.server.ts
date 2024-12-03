import type { Actions } from './$types';

export const actions = {
	sendReport: async ({request}) => {
    const data = await request.formData();

    const text = data.get('report');

    //TODO add magic stuff that sends the data somewhere
	},
} satisfies Actions;