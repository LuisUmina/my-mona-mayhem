import type { APIRoute } from 'astro';
import { contributionResponse } from '../../../lib/contribution-response.ts';

export const prerender = false;

export const GET: APIRoute = ({ params }) => contributionResponse(params.username);
