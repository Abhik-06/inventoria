// Importing necessary system components
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabase";

// Importing created components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if(authError) {
            setError(authError.message);
            setIsLoading(false);
        } else {
            navigate('/', {replace: true});
        }
    };

    return(
        <div className="flex h-screen w-full items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Maker_Space Login</CardTitle>
                    <CardDescription>
                        Enter your email to access the inventory.
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-foreground">
                                Email goes here
                            </label>

                            <input type="email" required value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="exampleStudent@egmail.in"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-foreground">
                                Password goes here
                            </label>

                            <input type="password" required value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="******"
                            />
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Spinner className="mr-2"/>
                                        Authenticating...
                                </>
                            ): (
                                "Sign In"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    ); 
}