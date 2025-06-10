export default defineAppConfig({
    ui:{
        primary: 'amber',
        gray: 'slate',
        notifications: {
            position: 'top-right'
        },
        card:{
            base: 'flex flex-col h-full w-full',
            body: {
                base: 'grow flex flex-col w-full'
            },
            header: {
                base: 'w-full'
            },
            footer: {
                base: 'w-full'
            }
        },
        table: {
            base: 'w-full',
            td: {
                base: 'w-full'
            },
            th: {
                base: 'w-full'
            }
        }
    }
})