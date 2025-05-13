import Feed from '@components/Feed'

const Home = () => {
    return (
        <section className="w-full flex-center flex-col">
            <h1 className="head_text text-center">
                Discover&nbsp;&amp;&nbsp;Share&nbsp;

            </h1>
                <span className="text-2xl sm:text-6xl font-extrabold leading-[1.15] orange_gradient text-center">
                    AI-Powered Prompts
                </span>
            <p className="desc text-center">
                Promptly is an open-source AI prompting tool for modern world to discover, create and share creative prompts
            </p>
            <Feed />
        </section>
    )
}

export default Home
