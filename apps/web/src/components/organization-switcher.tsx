"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

export function OrganizationSwitcher() {
	const { data: organizations } = authClient.useListOrganizations();
	const { data: activeOrganization } = authClient.useActiveOrganization();

	const handleSetActive = async (organizationId: string) => {
		await authClient.organization.setActive({ organizationId });
	};

	if (!organizations?.length) {
		return (
			<Button
				onClick={async () => {
					const { data, error } = await authClient.organization.create({
						name: "My Organization",
						slug: "my-org",
					});
					if (error) {
						console.error("Failed to create organization:", error);
					}
				}}
			>
				Create Organization
			</Button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="w-[200px] justify-between">
					{activeOrganization?.name || "Select Organization"}
					<ChevronDown className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-[200px]">
				{organizations.map((org) => (
					<DropdownMenuItem
						key={org.id}
						onClick={() => handleSetActive(org.id)}
						className={activeOrganization?.id === org.id ? "bg-accent" : ""}
					>
						{org.name}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
