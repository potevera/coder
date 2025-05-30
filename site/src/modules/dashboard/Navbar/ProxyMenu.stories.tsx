import type { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within } from "@storybook/test";
import { getAuthorizationKey } from "api/queries/authCheck";
import { getPreferredProxy } from "contexts/ProxyContext";
import { AuthProvider } from "contexts/auth/AuthProvider";
import { permissionChecks } from "modules/permissions";
import {
	MockAuthMethodsAll,
	MockPermissions,
	MockProxyLatencies,
	MockUserOwner,
	MockWorkspaceProxies,
} from "testHelpers/entities";
import { withDesktopViewport } from "testHelpers/storybook";
import { ProxyMenu } from "./ProxyMenu";

const defaultProxyContextValue = {
	latenciesLoaded: true,
	proxyLatencies: MockProxyLatencies,
	proxy: getPreferredProxy(MockWorkspaceProxies, undefined),
	proxies: MockWorkspaceProxies,
	isLoading: false,
	isFetched: true,
	setProxy: fn(),
	clearProxy: fn(),
	refetchProxyLatencies: () => new Date(),
};

const meta: Meta<typeof ProxyMenu> = {
	title: "modules/dashboard/ProxyMenu",
	component: ProxyMenu,
	args: {
		proxyContextValue: defaultProxyContextValue,
	},
	decorators: [
		(Story) => (
			<AuthProvider>
				<Story />
			</AuthProvider>
		),
		withDesktopViewport,
	],
	parameters: {
		queries: [
			{ key: ["me"], data: MockUserOwner },
			{ key: ["authMethods"], data: MockAuthMethodsAll },
			{ key: ["hasFirstUser"], data: true },
			{
				key: getAuthorizationKey({ checks: permissionChecks }),
				data: MockPermissions,
			},
		],
	},
};

export default meta;
type Story = StoryObj<typeof ProxyMenu>;

export const Closed: Story = {};

export const Opened: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole("button"));
	},
};

export const SingleProxy: Story = {
	args: {
		proxyContextValue: {
			...defaultProxyContextValue,
			proxies: [MockWorkspaceProxies[0]],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole("button"));
	},
};
