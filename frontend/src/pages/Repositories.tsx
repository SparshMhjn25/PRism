import { useEffect, useState } from "react"

type Repository = {
    id: string;
    github_repo_id: number;
    owner_login: string;
    name: string;
    default_branch: string;
}

export default function Repositories(){
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(()=>{
        async function fetchRepos(){
            try{
                const response = await fetch("http://localhost:3000/repositories");
                if(!response.ok){
                    throw new Error("Failed to fetch repositories")
                }
                const data = await response.json();
                setRepositories(data);
            }catch(err){
                setError(err instanceof Error ? err.message : "Something went wrong.");
            }finally{
                setIsLoading(false);
            }
        }
        fetchRepos();
    }, []);

    return(
        <div className="repositories-content">
            {isLoading ? (
                <p>Loading Repositories...</p>
            ) : error ? (
                <p>{error}</p>
            ) : repositories.length === 0 ? (
                <p>No repositories connected yet.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Repository</th>
                            <th>Owner</th>
                            <th>Default Branch</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {repositories.map((repository)=>(
                            <tr key={repository.id}>
                                <td>{repository.name}</td>
                                <td>{repository.owner_login}</td>
                                <td>{repository.default_branch}</td>
                                <td>
                                    <span className="status-badge completed">
                                        Connected
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}