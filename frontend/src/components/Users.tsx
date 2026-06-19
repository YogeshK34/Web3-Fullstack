/*eslint-disable*/
import { useEffect, useState } from "react";
import type { User } from '../../types/user';

export function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [name, setName] = useState<string>("");
    const [niche, setNiche] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3000/users');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                };

                // if the req is successful
                const data = await response.json();

                if (Array.isArray(data)) {
                    setUsers(data);
                } else if (data && typeof data === 'object' && Array.isArray((data as any).users)) {
                    setUsers((data as any).users);
                } else {
                    console.error('API did not return an array:', data);
                    setUsers([]);
                }

            } catch (err) {
                console.error('Failed to fetchc users!', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []) // to run on the first render

    const createUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/create', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, niche })
            });

            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`)
            };

            const { data } = await response.json();
            setUsers(prev => [...prev, data]);
            setIsCreatingUser(false);


        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            {users && users.length > 0 ? (
                users.map((user) =>
                    <ul key={user.id}>
                        <li>{user.name}</li>
                        <li>{user.niche}</li>
                    </ul>
                )
            ) : (
                <p>No users found</p>
            )}

            {isCreatingUser ? (
                <>
                    <input
                        type='text'
                        value={name}
                        disabled={loading}
                        onChange={(e) => setName(e.target.value)}
                    ></input>

                    <input
                        type='text'
                        value={niche}
                        disabled={loading}
                        onChange={(e) => setNiche(e.target.value)}
                    ></input>

                    <button onClick={createUsers}>Create</button>
                </>
            ) : (
                <button onClick={() => setIsCreatingUser(true)}>Create User</button>
            )}
        </div>
    )
}