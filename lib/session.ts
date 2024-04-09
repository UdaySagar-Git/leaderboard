import { getServerSession } from "next-auth";
import { getContributors } from "./api";

export const session = async ({ session, token }: any) => {
  if (token) {
    session.user.id = token.id;
    session.user.username = token.username;
  }
  const contributors = await getContributors();
  const user = contributors.find(
    (contributor) => contributor.github === session.user.username,
  );

  session.user.role = user?.role;
  session.user.data = {
    name: user?.name,
    title: user?.title,
    content: user?.content,
    github: user?.github,
    twitter: user?.twitter,
    linkedin: user?.linkedin,
    slack: user?.slack,
  };
  return session;
};

export const getUserSession = async () => {
  const authUserSession = await getServerSession({
    callbacks: {
      session,
    },
  });
  if (!authUserSession) return null;
  return authUserSession.user;
};
