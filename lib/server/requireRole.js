// src/app/lib/server/requireRole.js

import { getUserSession } from '../core/session';

export const requireRole = async (role) => {
  const session = await getUserSession();

  if (!session) {
    return {
      user: null,
      error: Response.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  if (role && session.user.role !== role) {
    return {
      user: null,
      error: Response.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  return { user: session.user, error: null };
};
