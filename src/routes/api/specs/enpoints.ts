import { Endpoint } from 'pepefolio';

export default [
    {
        name: 'Sign In',
        path: 'operator/sign-in',
        version: 1,
        credentials: 'include',
        variants: [
            {
                method: 'POST',
                parameters: {
                    body: [
                        {
                            label: 'userName',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                },
            },
        ],
    },
    {
        name: 'Sign Out',
        path: 'operator/sign-out',
        version: 1,
        credentials: 'include',
        variants: [
            {
                method: 'POST',
            },
        ],
    },
    {
        name: 'Event Registry',
        path: 'admin/registry/event',
        version: 1,
        credentials: 'include',
        variants: [
            {
                method: 'GET',
                parameters: {
                    query: [
                        {
                            label: 'id',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'name',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'date',
                            defaultValue: '',
                            type: 'Date',
                        },
                        {
                            label: 'isOpen',
                            defaultValue: '',
                            type: 'boolean',
                        },
                    ],
                },
            },
            {
                method: 'POST',
                parameters: {
                    body: [
                        {
                            label: 'name',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'date',
                            defaultValue: '',
                            type: 'Date',
                        },
                        {
                            label: 'isOpen',
                            defaultValue: '',
                            type: 'boolean',
                        },
                    ],
                },
            },
            {
                method: 'PATCH',
                parameters: {
                    search: [
                        {
                            label: 'id',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                    body: [
                        {
                            label: 'name',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'isOpen',
                            defaultValue: '',
                            type: 'boolean',
                        },
                    ],
                },
            },
            {
                method: 'DELETE',
                parameters: {
                    search: [
                        {
                            label: 'id',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                },
            },
        ],
    },
    {
        name: 'Event Order Registry',
        path: 'admin/registry/event/order',
        version: 1,
        credentials: 'include',
        variants: [
            {
                method: 'GET',
                parameters: {
                    query: [
                        {
                            label: 'id',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'eventId',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'status',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'operatorId',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'clientName',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                },
            },
            {
                method: 'POST',
                parameters: {
                    body: [
                        {
                            label: 'eventId',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'items',
                            defaultValue: '',
                            type: 'Items[]',
                        },
                        {
                            label: 'operatorId',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'status',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                },
            },
            {
                method: 'PATCH',
                parameters: {
                    search: [
                        {
                            label: 'id',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                    body: [
                        {
                            label: 'status',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                },
            },
            {
                method: 'DELETE',
                parameters: {
                    search: [
                        {
                            label: 'id',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                },
            },
        ],
    },
    {
        name: 'Event Order Status',
        path: 'admin/registry/event/order/status',
        version: 1,
        credentials: 'include',
        variants: [
            {
                method: 'GET',
            },
        ],
    },
    {
        name: 'Event Order Status',
        path: 'admin/registry/event/order/qr',
        version: 1,
        credentials: 'include',
        variants: [
            {
                method: 'GET',
                parameters: {
                    search: [
                        {
                            label: 'orderId',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                },
            },
        ],
    },
    {
        name: 'Menu Registry',
        path: 'admin/registry/menu',
        version: 1,
        credentials: 'include',
        variants: [
            {
                name: 'Search Menus',
                method: 'GET',
                parameters: {
                    query: [
                        {
                            label: 'id',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'title',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'parentId',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                },
            },
            {
                name: 'Create Menu',
                method: 'POST',
                parameters: {
                    body: [
                        {
                            label: 'title',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'icon',
                            defaultValue: '',
                            type: 'base64',
                        },
                        {
                            label: 'route',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'parentId',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                },
            },
            {
                name: 'Update Menu',
                method: 'UPDATE',
                parameters: {
                    body: [
                        {
                            label: 'title',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'icon',
                            defaultValue: '',
                            type: 'base64',
                        },
                        {
                            label: 'route',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                    search: [
                        {
                            label: 'id',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                },
            },
            {
                name: 'Delete Menu',
                method: 'DELETE',
                parameters: {
                    search: [
                        {
                            label: 'id',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                },
            },
        ],
    },
    {
        name: 'Operator Menus',
        path: 'admin/registry/menu/self',
        version: 1,
        credentials: 'include',
        variants: [
            {
                name: 'Operator Menus',
                method: 'GET',
            },
        ],
    },
    {
        name: 'Operator Registry',
        path: 'admin/registry/operator',
        version: 1,
        credentials: 'include',
        variants: [
            {
                method: 'GET',
                parameters: {
                    query: [
                        {
                            label: 'id',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'realmId',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'displayName',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                },
            },
            {
                method: 'POST',
                parameters: {
                    body: [
                        {
                            label: 'userName',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'displayName',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'realmId',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'role',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'photo',
                            defaultValue: '',
                            type: 'base64',
                        },
                    ],
                },
            },
            {
                method: 'PATCH',
                parameters: {
                    search: [
                        {
                            label: 'id',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                    body: [
                        {
                            label: 'displayName',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'role',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'photo',
                            defaultValue: '',
                            type: 'base64',
                        },
                    ],
                },
            },
            {
                method: 'DELETE',
                parameters: {
                    search: [
                        {
                            label: 'id',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                },
            },
        ],
    },
    {
        name: 'Operator Roles',
        path: 'admin/registry/operator/roles',
        version: 1,
        credentials: 'include',
        variants: [
            {
                method: 'GET',
            },
        ],
    },
    {
        name: 'Operator Data',
        path: 'admin/registry/operator/self',
        version: 1,
        credentials: 'include',
        variants: [
            {
                method: 'GET',
            },
        ],
    },
    {
        name: 'Product Registry',
        path: 'admin/registry/product',
        version: 1,
        credentials: 'include',
        variants: [
            {
                method: 'GET',
                parameters: {
                    query: [
                        {
                            label: 'id',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'name',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'realmId',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                },
            },
            {
                method: 'POST',
                parameters: {
                    body: [
                        {
                            label: 'name',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'realmId',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'ingredients',
                            defaultValue: '',
                            type: 'Ingredients[]',
                        },
                    ],
                },
            },
            {
                method: 'PATCH',
                parameters: {
                    search: [
                        {
                            label: 'id',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                    body: [
                        {
                            label: 'name',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'realmId',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'ingredients',
                            defaultValue: '',
                            type: 'Ingredients[]',
                        },
                    ],
                },
            },
            {
                method: 'DELETE',
                parameters: {
                    search: [
                        {
                            label: 'id',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                },
            },
        ],
    },
    {
        name: 'Realm Registry',
        path: 'admin/registry/realm',
        version: 1,
        credentials: 'include',
        variants: [
            {
                method: 'GET',
                parameters: {
                    query: [
                        {
                            label: 'id',
                            defaultValue: '',
                            type: 'string',
                        },
                        {
                            label: 'name',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                },
            },
            {
                method: 'POST',
                parameters: {
                    body: [
                        {
                            label: 'name',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                },
            },
            {
                method: 'PATCH',
                parameters: {
                    search: [
                        {
                            label: 'id',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                    body: [
                        {
                            label: 'name',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                },
            },
            {
                method: 'DELETE',
                parameters: {
                    search: [
                        {
                            label: 'id',
                            defaultValue: '',
                            type: 'string',
                        },
                    ],
                },
            },
        ],
    },
] as Endpoint[];
