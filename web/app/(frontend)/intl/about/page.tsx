import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * The "Who we are" page for the HQ site, at /intl/about.
 *
 * Content and layout follow the Figma design (node 39:2839, "Who we are").
 * The sibling About pages it links to (mission statement, statement of
 * faith, history, leadership) do not exist as routes in this app yet, so
 * the sub-navigation those pages would share is left out rather than
 * pointing at dead links — add it back once those pages land.
 */

export const metadata: Metadata = {
  title: 'Who we are',
  description:
    'Apostolos Missions International is an interdenominational ministry committed to spreading the gospel to the ends of the earth.',
  alternates: { canonical: '/intl/about' },
};

export default function AboutPage() {
  return (
    <main id="main">
      <section className="page-hero page-hero--photo">
        <div className="page-hero__media">
          <img src="/img/hero-about.svg" alt="" loading="lazy" width={1920} height={760} />
        </div>
        <div className="container">
          <ol className="breadcrumb">
            <li>
              <Link href="/intl">Home</Link>
            </li>
            <li>About</li>
          </ol>
          <h1>Who we are</h1>
          <p className="lede">
            An interdenominational ministry committed to spreading the gospel to the ends of the
            earth, testifying to the eternal love of the Lord.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="prose">
            <p className="lede">
              Apostolos Missions International (AM) is an interdenominational ministry committed
              to spreading the gospel to the ends of the earth, testifying to the eternal love of
              the Lord.
            </p>
            <p>
              The name <em>apostolos</em> (ἀπόστολος) is the Greek word for apostle. It means
              “one who is sent on a mission” or “messenger.” The title “apostle” often comes out
              in the New Testament to represent the Twelve disciples appointed by Jesus (Matthew
              10:2, Mark 3:14, Luke 6:13, Acts 2:42). Paul, a former persecutor of Christianity
              turning to a great herald of the gospel, introduced himself as an “apostle” (Romans
              1:1, 1 Corinthians 1:1, 2 Corinthians 1:1, Galatians 1:1, Colossians 1:1, 1 Timothy
              1:1, 2 Timothy 1:1, Titus).
            </p>
            <p>
              Apostles are those who are sent by the Lord to fulfill the mission of “preaching
              Jesus Christ and making God known” to the whole creation. Biblical foundation of
              apostleship is found in many words of the Lord who selected first apostles and sent
              them out like the ambassadors dispatched to represent different nations. Apostles
              understood that their lives were not just their own, but they lived to reveal the
              glory of Christ in this fallen world.
            </p>
            <blockquote>
              John 20:21 says, “Again Jesus said, ‘Peace be with you! As the Father has sent me, I
              am sending you.’” (NIV)
            </blockquote>
            <p>
              AM wishes to follow the tradition of the apostles who lived as people on a mission
              to proclaim the Word of God. Each of us also receive this calling from God to be
              sent out into the world as His hands and feet. We wish to dedicate our lives to
              follow the footsteps of Jesus and proclaim the Gospel until the ends of the earth.
            </p>
            <p>
              Just as our lives have been touched and changed by the Lord, we wish to reveal the
              love of the Lord that was shown to us, becoming a beacon for all of His lost
              children and our fellow brothers and sisters.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <div className="section-head section-head--center">
            <p className="eyebrow">In practice</p>
            <h2>Four things we do everywhere we go.</h2>
          </div>
          <div className="pillars">
            <div className="pillar">
              <span className="pillar__num" />
              <h3>Bible study</h3>
              <p>Small and large group study that puts Scripture at the centre of campus life.</p>
            </div>
            <div className="pillar">
              <span className="pillar__num" />
              <h3>Leadership training</h3>
              <p>Students are coached to lead their peers, then to send the next group out.</p>
            </div>
            <div className="pillar">
              <span className="pillar__num" />
              <h3>Online education</h3>
              <p>AM Academy courses in Scripture, missiology and cross-cultural ministry.</p>
            </div>
            <div className="pillar">
              <span className="pillar__num" />
              <h3>Internships &amp; trips</h3>
              <p>Short-term missions and internships that turn training into practice.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-band__inner">
          <div>
            <p className="eyebrow eyebrow--on-dark">Partner with us</p>
            <h2>Send someone you will never meet.</h2>
            <p className="lede">
              Every gift puts Bible study, training and a sending community within reach of
              students who are ready to go.
            </p>
          </div>
        </div>
      </section>

      <section className="field-notes">
        <div className="field-notes__media">
          <img src="/img/feature-campuses.svg" alt="" loading="lazy" width={1600} height={420} />
        </div>
        <div className="container field-notes__inner">
          <div>
            <h2>Field Notes from the Campuses</h2>
            <p>A short monthly letter: what students are seeing, where AM is going next, and how to pray.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
