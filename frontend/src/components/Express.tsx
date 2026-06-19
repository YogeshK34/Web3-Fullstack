import { useEffect, useState } from "react";
import type { ExpressServer, } from "../../types/express";

export function ExpressServerComponent() {
    const [data, setData] = useState<ExpressServer | null>(null);

    useEffect(() => {
        const checkExpressServer = async () => {
            try {
                const response = await fetch('http://localhost:3000/');

                if (!response.ok) {
                    throw new Error(`Http Error! status: ${response.status}`);
                };

                const data: ExpressServer = await response.json();
                setData(data);

            } catch (err) {
                console.error(err);
            }
        };

        checkExpressServer();
    }, []);

    return (
        <div>
            {data ? (
                <p>{data.message}</p>
            ) : (
                <p>No response from Express</p>
            )}
        </div>
    )
}