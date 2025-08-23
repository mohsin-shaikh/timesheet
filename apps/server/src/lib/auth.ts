import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { db } from "../db";
import * as schema from "../db/schema/auth";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",

		schema: schema,
	}),
	plugins: [
		organization({
			// Optional: Configure organization settings
			allowUserToCreateOrganization: true,
			organizationLimit: 5,
			creatorRole: "owner",
			membershipLimit: 100,
			invitationExpiresIn: 48 * 60 * 60, // 48 hours in seconds
			invitationLimit: 100,
			requireEmailVerificationOnInvitation: false,
			// Optional: Custom invitation email function
			// sendInvitationEmail: async (data) => {
			//   // Implement your email sending logic
			// },
		}),
	],
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
	emailAndPassword: {
		enabled: true,
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
});
