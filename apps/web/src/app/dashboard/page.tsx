"use client";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { OrganizationSwitcher } from "@/components/organization-switcher";

export default function Dashboard() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();
	const { data: activeOrganization } = authClient.useActiveOrganization();

	const privateData = useQuery(trpc.privateData.queryOptions());

	useEffect(() => {
		if (!session && !isPending) {
			router.push("/login");
		}
	}, [session, isPending]);

	if (isPending) {
		return <div>Loading...</div>;
	}

	return (
		<div className="p-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Dashboard</h1>
				<OrganizationSwitcher />
			</div>
			
			<div className="space-y-4">
				<div className="p-4 bg-card rounded-lg border">
					<h2 className="text-lg font-semibold mb-2">Welcome</h2>
					<p>Hello, {session?.user.name}!</p>
					{activeOrganization && (
						<p className="text-sm text-muted-foreground">
							Currently working in: <strong>{activeOrganization.name}</strong>
						</p>
					)}
				</div>

				<div className="p-4 bg-card rounded-lg border">
					<h2 className="text-lg font-semibold mb-2">API Test</h2>
					<p>privateData: {privateData.data?.message}</p>
				</div>

				{activeOrganization && (
					<div className="p-4 bg-card rounded-lg border">
						<h2 className="text-lg font-semibold mb-2">Organization Info</h2>
						<p><strong>Name:</strong> {activeOrganization.name}</p>
						<p><strong>Slug:</strong> {activeOrganization.slug}</p>
						<p><strong>Created:</strong> {new Date(activeOrganization.createdAt).toLocaleDateString()}</p>
					</div>
				)}
			</div>
		</div>
	);
}
