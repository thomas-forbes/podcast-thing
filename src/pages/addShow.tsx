import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { NextSeo } from 'next-seo'
import { useState } from 'react'
import Background from '../components/Background'
import Question from '../components/Question'
import StyledLink from '../components/StyledLink'
import { getServerAuthSession } from '../server/common/get-server-auth-session'
import { trpc } from '../utils/trpc'

export default function AddPodcast() {
  const addShow = trpc.podcast.addShow.useMutation()

  const [rssLink, setRssLink] = useState('')
  return (
    <>
      <NextSeo title="Add Episode" />
      <Background mainColumn className="max-w-4xl">
        <h1 className="text-center text-5xl font-bold">
          Enter Podcast Information
        </h1>
        {/* RSS */}
        <div className="flex w-full max-w-lg flex-col space-y-4">
          {/* RSS LINK */}
          <Question
            label="RSS Link"
            value={rssLink}
            setValue={setRssLink}
            placeholder={'https://example.com/rss'}
          />
          {/* SLUG */}
          {/* <Question
          label="Slug name for podcast"
          value={slug}
          setValue={setSlug}
          placeholder="example-podcast"
        /> */}
          {/* ADD */}
          <button
            className="rounded-md bg-sky-500 py-2 px-4 text-lg font-semibold text-sky-100 outline-offset-2 transition active:transition-none enabled:hover:bg-sky-400 enabled:active:bg-sky-500 enabled:active:text-sky-100/80 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-600 enabled:dark:hover:bg-sky-500 enabled:dark:active:bg-sky-600 enabled:dark:active:text-sky-100/70"
            disabled={addShow.isLoading || !rssLink}
            onClick={() => addShow.mutate({ rssLink })}
          >
            Add
          </button>
        </div>
        {addShow.isError ? (
          <p>{addShow.error.message}</p>
        ) : addShow.data ? (
          <div className="flex flex-col space-y-2">
            <h2 className="text-2xl font-bold">We got this information</h2>
            <table>
              <thead>
                <tr>
                  {['Property', 'Value'].map((value) => (
                    <th key={value} className="border border-white px-2 py-1">
                      {value}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(addShow.data).map(([key, value]) => (
                  <tr key={key}>
                    {[key, value].map((value, i) => (
                      <td
                        key={value}
                        className={`border border-black px-2 py-1 dark:border-white ${
                          i == 0 && 'dark:text-slate-400'
                        }`}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        {addShow.isSuccess && (
          <StyledLink href="/addEpisode">Add Episode</StyledLink>
        )}
      </Background>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(ctx)
  if (!session?.user) {
    return {
      redirect: {
        destination:
          '/api/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2FaddShow',
        permanent: false,
      },
    }
  }
  return { props: {} }
}
