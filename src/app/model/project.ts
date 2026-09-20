export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  tech: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
}