import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // שליפת הטוקן מהאחסון המקומי של הדפדפן
  const token = localStorage.getItem('token');

  // אם קיים טוקן, אנחנו משכפלים את הבקשה ומוסיפים לה את ה-Header המבוקש
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // מעבירים את הבקשה המשוכפלת (עם הטוקן) להמשך הטיפול
    return next(authReq);
  }

  // אם אין טוקן (למשל בדף התחברות), מעבירים את הבקשה המקורית כפי שהיא
  return next(req);
};
