// eslint-disable-next-line react/no-typos` 
import 'react';

declare module "*.module.css";

declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}