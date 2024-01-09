'use client'
import * as React from 'react';

import './globals.css'
import { UIProvider } from '@/context/UI';
import { UserProvider } from '@/context/User';
import AuthLeyoutTheme from '@/components/layout/auth';


interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
  persistent: HTMLInputElement;
}
interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir='rtl'>
      <body>
        <UIProvider>
          <UserProvider>
            <AuthLeyoutTheme>
              {children}
            </AuthLeyoutTheme>
          </UserProvider>
        </UIProvider>
      </body>
    </html>
  );
}