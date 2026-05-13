import { SVGProps } from "react";

type SVGIconProps = SVGProps<SVGSVGElement> & { className?: string };

export function SearchIcon({ className, ...props }: SVGIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </svg>
  );
}

export function ChevronLeftIcon({ className, ...props }: SVGIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256" className={className} {...props}>
      <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
    </svg>
  );
}

export function ChevronRightIcon({ className, ...props }: SVGIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256" className={className} {...props}>
      <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
    </svg>
  );
}

export function InstagramIcon({ className, ...props }: SVGIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 27" fill="none" className={className} {...props}>
      <path fill="#fff" fillRule="evenodd" d="M9 2.25h9A6.75 6.75 0 0 1 24.75 9v9A6.75 6.75 0 0 1 18 24.75H9A6.75 6.75 0 0 1 2.25 18V9A6.75 6.75 0 0 1 9 2.25M9 4.5A4.5 4.5 0 0 0 4.5 9v9A4.5 4.5 0 0 0 9 22.5h9a4.5 4.5 0 0 0 4.5-4.5V9A4.5 4.5 0 0 0 18 4.5zm4.5 14.625a5.625 5.625 0 1 1 0-11.25 5.625 5.625 0 0 1 0 11.25m0-2.25a3.375 3.375 0 1 0 0-6.75 3.375 3.375 0 0 0 0 6.75M19.125 9a1.125 1.125 0 1 1 0-2.25 1.125 1.125 0 0 1 0 2.25" clipRule="evenodd" />
    </svg>
  );
}

export function TikTokIcon({ className, ...props }: SVGIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 27" fill="none" className={className} {...props}>
      <path fill="#fff" fillRule="evenodd" d="M18.113 2.25c.39 3.193 2.26 5.096 5.512 5.299v3.591c-1.884.175-3.535-.412-5.455-1.519v6.717c0 8.532-9.762 11.198-13.687 5.083-2.522-3.936-.978-10.841 7.113-11.118v3.787c-.617.094-1.275.243-1.878.439-1.799.58-2.82 1.667-2.536 3.584.546 3.672 7.616 4.759 7.028-2.417V2.256h3.903z" clipRule="evenodd" />
    </svg>
  );
}

export function FacebookIcon({ className, ...props }: SVGIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 27" fill="none" className={className} {...props}>
      <path fill="#fff" fillRule="evenodd" d="M17.071 5.986h2.054V2.408c-.354-.048-1.573-.158-2.992-.158-2.962 0-4.99 1.863-4.99 5.287v3.15H7.875v4h3.268V24.75h4.006V14.688h3.136l.498-4h-3.635V7.933c.001-1.156.313-1.947 1.923-1.947" clipRule="evenodd" />
    </svg>
  );
}
