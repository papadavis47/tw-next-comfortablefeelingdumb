import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import readingTime from 'reading-time'
import Thanks from '@/components/Thanks'

// type Slug = string | string[]

const components = { Image }
const PostPage = ({
  frontMatter: { title, date, description },
  mdxSource,
  readingTime,
}) => {
  return (
    <>
      <div className="prose mx-auto my-10 px-6 pb-10 pt-6 lg:prose-xl">
        <h1 className="not-prose bg-gradient-to-l from-jacksonsPurple to-purpleMountain bg-clip-text pb-2 font-extrabold capitalize text-transparent lg:text-6xl">
          {title}
        </h1>
        <p>{date}</p>
        <p>{readingTime}</p>
        <MDXRemote {...mdxSource} components={components} />
        <Thanks />
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync(path.join('posts'))
  const paths = files.map((filename) => {
    return {
      params: {
        slug: filename,
      },
    }
  })

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params: { slug } }) => {
  // Doing some type checking below! Making sure slug is string : )
  // Learning the TypeScript kung fu!
  let goodSlug
  if (typeof slug === 'string') {
    goodSlug = slug
  }
  const mdxWithMeta = fs.readFileSync(
    path.join('posts', goodSlug, 'index.mdx'),
    'utf-8'
  )

  const { data: frontMatter, content } = matter(mdxWithMeta)

  const mdxSource = await serialize(content)

  return {
    props: {
      frontMatter,
      slug,
      mdxSource,
      readingTime: readingTime(content).text,
    },
  }
}

export default PostPage
