import { Modal, PasswordForm } from "@components";
import Head from "next/head";
import { useState } from "react";

import type { NextPage } from "next";

const seperateNumber = (x: number) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const Home: NextPage = (props: any) => {
    const [uniqueID, setUniqueID] = useState<string>("");
    const [iv, setIv] = useState<string>("");
    const [validInSec, setValidInSec] = useState<number>(0);

    const totalGenerated = seperateNumber(props.totalGenerated);

    return (
        <>
            <Head>
                <title>
                    Paswords. The safest way to send passwords over the
                    internet.
                </title>
                <meta
                    name="description"
                    content="Paswords allows users from all over the world to share passwords in a secure way. Using our one-time-only link feature no-one gets access to your password except the people you choose."
                />
            </Head>
            <div className="hero items-start sm:items-center">
                <div className="hero-content flex-col lg:flex-row">
                    <div>
                        <h1 className="text-5xl font-bold">One Time Link</h1>
                        <p>
                            Total links sent:{" "}
                            <span className="text-primary">
                                {totalGenerated}
                            </span>
                        </p>
                        <p className="py-6">
                            Fill in the password you want to share in the form.
                            You can share a password generated by our service
                            (under construction!) or you can paste in your own.
                            Make sure your password is secure and not used for
                            any other service!
                        </p>
                        <p>
                            We use some of the most advanced encryption
                            algorithms to make sure your password is safe. We do
                            not store your password in any way. If you would
                            like to know exactly what happens to your password,
                            make sure to check out{" "}
                            <a
                                rel="noopener noreferrer"
                                href="https://github.com/larsniet/paswords"
                                target="_blank"
                                className="text-primary"
                            >
                                the public Github repository
                            </a>
                            .
                        </p>
                    </div>
                    <PasswordForm
                        setUniqueID={setUniqueID}
                        setIv={setIv}
                        setValidInSec={setValidInSec}
                    />
                </div>
            </div>
            <Modal uniqueID={uniqueID} iv={iv} validInSec={validInSec} />
        </>
    );
};

export default Home;

export async function getServerSideProps() {
    const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/passwords"
    );
    const data = await res.json();
    const totalGenerated = data.count;

    return {
        props: { totalGenerated },
    };
}
