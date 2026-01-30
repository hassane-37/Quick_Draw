import './Header.css';

export default function Header({ id, bgColor }) {
  return (
    <header className="header" style={{backgroundColor:bgColor}}>
      <div className="header__logo" >
        <img src="/QuickDrawLogo.png" alt="Logo" />
      </div>

      <div className="header__github">
        <a
          href="https://github.com/hassane-37/Quick_Draw"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="github-icon"
          >
            <path
              fill="currentColor"
              d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.42 7.86 10.95.57.1.78-.25.78-.55
              0-.27-.01-1.16-.02-2.1-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7
              -1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19
              1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55
              -2.55-.29-5.23-1.27-5.23-5.65 0-1.25.45-2.27 1.18-3.07
              -.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.17
              .91-.25 1.88-.38 2.85-.38.97 0 1.94.13 2.85.38
              2.18-1.48 3.14-1.17 3.14-1.17.63 1.57.24 2.73.12 3.02
              .73.8 1.17 1.82 1.17 3.07 0 4.39-2.69 5.36-5.25 5.64
              .41.36.78 1.08.78 2.18 0 1.57-.02 2.83-.02 3.22
              0 .31.21.66.79.55C20.71 21.41 24 17.09 24 12
              24 5.73 18.77.5 12 .5z"
            />
          </svg>
        </a>
      </div>
    </header>
  );
}
