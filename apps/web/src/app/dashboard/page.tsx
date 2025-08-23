"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { OrganizationSwitcher } from "@/components/organization-switcher";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

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
			<div className="mb-6 flex items-center justify-between">
				<h1 className="font-bold text-2xl">Dashboard</h1>
				<OrganizationSwitcher />
			</div>
			
			<div className="space-y-4">
				<div className="rounded-lg border bg-card p-4">
					<h2 className="mb-2 font-semibold text-lg">Welcome</h2>
					<p>Hello, {session?.user.name}!</p>
					{activeOrganization && (
						<p className="text-muted-foreground text-sm">
							Currently working in: <strong>{activeOrganization.name}</strong>
						</p>
					)}
				</div>

				<div className="rounded-lg border bg-card p-4">
					<h2 className="mb-2 font-semibold text-lg">API Test</h2>
					<p>privateData: {privateData.data?.message}</p>
				</div>

				{activeOrganization && (
					<div className="rounded-lg border bg-card p-4">
						<h2 className="mb-2 font-semibold text-lg">Organization Info</h2>
						<p><strong>Name:</strong> {activeOrganization.name}</p>
						<p><strong>Slug:</strong> {activeOrganization.slug}</p>
						<p><strong>Created:</strong> {new Date(activeOrganization.createdAt).toLocaleDateString()}</p>
					</div>
				)}
			</div>
		</div>
	);
}
