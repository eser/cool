import * as path from "$std/path/mod.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

const links: Array<string> = [];
for (const file of Deno.readDirSync(__dirname)) {
  if (file.name.startsWith("index")) continue;
  const name = path.basename(file.name, path.extname(file.name));
  links.push(name);
}

export default function Home() {
  return (
    <div>
      <h1>Tests</h1>
      <ul>
        {links.sort().map((link) => {
          return (
            <li key={link}>
              <a href={`/${link}`}>{link}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}