import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Github, Twitter, Linkedin, LinkIcon, User } from 'lucide-react'

type ProfileLink = {
  type: 'github' | 'twitter' | 'linkedin' | 'other'
  url: string
}

type ProfileCardProps = {
  name?: string
  image?: string
  role?: string
  links?: ProfileLink[]
}

const iconMap = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  other: LinkIcon,
}

export default function ProfileCard({ name, image, role, links = [] }: ProfileCardProps) {
  const initials = name 
    ? name.split(' ').map(n => n[0]).join('').toUpperCase()
    : '';

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="flex flex-col items-center">
        <Avatar className="w-24 h-24">
          {image ? (
            <AvatarImage src={image} alt={name || 'Profile picture'} />
          ) : null}
          <AvatarFallback>
            {initials || <User className="w-14 h-14" />}
          </AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="text-center">
        {name && <h2 className="text-2xl font-bold">{name}</h2>}
        {role && <p className="text-muted-foreground">{role}</p>}
      </CardContent>
      {links.length > 0 && (
        <CardFooter className="flex justify-center space-x-2">
          {links.map((link, index) => {
            const Icon = iconMap[link.type]
            return (
              <Button key={index} variant="outline" size="icon" asChild>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{link.type} profile</span>
                </a>
              </Button>
            )
          })}
        </CardFooter>
      )}
    </Card>
  )
}

