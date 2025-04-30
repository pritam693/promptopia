import '@styles/globals.css'
import Nav from '@components/Nav'
import Provider from '@components/Provider'
export const metadata = {
    title: 'Promptly',
    description: 'Discover & Share AI Prompts',
    icons: {
        icon: '/favicon.ico',
    },
}
const RootLayout = ({ children }) => {
    return (
        <html lang="en">
        <head>
                {/* This will load the SVG as the favicon */}
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body>
                <Provider>
                    <div className='main'>
                        <div className='gradient' />
                    </div>
                    <main className='app'>
                        <Nav />
                        {children}
                    </main>
                </Provider>
            </body>
        </html>
    )
}

export default RootLayout
