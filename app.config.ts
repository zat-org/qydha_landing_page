export default defineAppConfig({
    ui: {
        colors: {
            primary: 'amber',
            neutral: 'slate'
        },

        notifications: {
            position: 'top-right'
        },
        card: {
            slots: {
                root: 'flex flex-col flex-1 h-full w-full p-2 ',
                header: 'w-full ',
                body: ' w-full flex flex-col flex-1  ',
                footer: 'w-full'
            }
        },
        table: {
            slots: {
                root: "flex-1",
                td: "p-2"
            }
        },
        tabs: {
            slots: {
                root: "flex-1",
                content: "flex flex-col  flex-1"
            }
        },
        pagination: {
            slots: {
                list: 'flex-row-reverse',

            }
        },
        
        input: {
            slots: {
                root: 'w-full',
                base: 'w-full text-right px-3 md:px-4 py-2 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200',
            }
        },
        select: {
            slots: {
                root: 'w-full',
                base: 'relative w-full text-right pl-10 pr-3 md:pl-10 md:pr-4 py-2 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200',
                value: 'text-right w-full',
                trailing: 'absolute inset-y-0 left-0 flex items-center pointer-events-none',
                item: 'text-right',
                label: 'text-right',
                content: 'text-right',
            } 
        },
        selectMenu: {
            slots: {
                root: 'w-full',
                base: 'relative w-full text-right pl-10 pr-3 md:pl-10 md:pr-4 py-2 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200',
                value: 'text-right w-full',
                trailing: 'absolute inset-y-0 left-0 flex items-center pointer-events-none',
                item: 'text-right',
                label: 'text-right',
                content: 'text-right',
            }
        },
        textarea: {
            slots: {
                root: 'w-full',
                base: 'w-full text-right px-3 md:px-4 py-2 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200',

            }
        },
        formField: {
            slots: {
                error: 'text-xs mt-1 text-red-500'

            }
        }

    }
})