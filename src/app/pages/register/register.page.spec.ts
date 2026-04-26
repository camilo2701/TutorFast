import { RegisterPage } from './register.page';

const page = new RegisterPage();

page.selectRole('tutor');

if (page.user.role !== 'tutor') {
  throw new Error('El rol no cambió correctamente a tutor');
}

export {};