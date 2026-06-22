import {
  Card,
  CardAction,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/Logo";

const DeleteAccountSuccess = () => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <main className="auth-content">
          <div className="flex min-h-svh flex-col items-center justify-center bg-background">
            <Card>
              <CardHeader>
                <CardTitle>Delete Account</CardTitle>
                <CardDescription>Delete Confirmation</CardDescription>
                <CardAction>
                  <Logo />
                </CardAction>
              </CardHeader>
              <CardContent>
                <h1>Your account has been deleted successfully</h1>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DeleteAccountSuccess;
