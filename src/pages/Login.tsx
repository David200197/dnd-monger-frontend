import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { LoginInput, loginSchema } from '@/lib/schemas/authSchemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dices } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const Login = () => {
  const { t } = useTranslation(['ui', 'common']);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    // TODO: Implement actual login logic with backend
    console.log('Login data:', data);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background-secondary to-background p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <Card className="w-full max-w-md shadow-elegant border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              <Dices className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('common:appName')}
              </span>
            </div>
          </div>
          <CardTitle className="text-2xl">{t('ui:auth.login')}</CardTitle>
          <CardDescription>{t('common:welcome')}</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t('ui:auth.username')}</Label>
              <Input
                id="username"
                type="text"
                placeholder={t('ui:auth.username')}
                {...register('username')}
                className={errors.username ? 'border-destructive' : ''}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{t(errors.username.message as string)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('ui:auth.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('ui:auth.password')}
                {...register('password')}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{t(errors.password.message as string)}</p>
              )}
            </div>

            <Link to="/forgot-password" className="text-sm text-primary hover:underline block text-right">
              {t('ui:auth.forgotPassword')}
            </Link>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-gradient-primary hover:shadow-glow" disabled={isSubmitting}>
              {isSubmitting ? '...' : t('ui:auth.login')}
            </Button>
            
            <p className="text-sm text-center text-muted-foreground">
              {t('ui:auth.noAccount')}{' '}
              <Link to="/signup" className="text-primary hover:underline">
                {t('ui:auth.signup')}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
