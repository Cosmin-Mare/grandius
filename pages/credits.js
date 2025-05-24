import Head from "next/head";
import { Press_Start_2P } from "next/font/google";
import styles from "@/styles/Home.module.css";
import ShaderCanvas from "@/components/ShaderCanvas";
import Link from "next/link";
s
const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export default function Credits() {
  return (
    <>
      <div className={styles.shaderContainer}>
        <ShaderCanvas />
      </div>
      <Head>
        <title>Credits - Grandius</title>
        <meta name="description" content="Credits for Grandius" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.page} ${pressStart2P.variable}`}>
        <div className={styles.main}>
          <div className={styles.header}>
            <h1>Credits</h1>
            <h2>Thank You</h2>
          </div>
          
          <div className={styles.creditsContent}>
            <div className={styles.creditSection}>
              <h3>Development Team</h3>
              <p>Cosmin Mare</p>
              <p>Nathan Yin</p>
              <p>Simo</p>
            </div>

            <div className={styles.creditSection}>
              <h3>Special Thanks</h3>
              <p>Cool as Hack</p>
              <p>Next.js Team</p>
              <p>WebGL Community</p>
            </div>

            <div className={styles.creditSection}>
              <h3>Technologies Used</h3>
              <p>Next.js</p>
              <p>React</p>
              <p>WebGL</p>
              <p>CSS Modules</p>
            </div>
          </div>

          <div className={styles.creditsBackButton}>
            <Link href="/" className={styles.primary}>
              Back to Game
            </Link>
          </div>
        </div>
      </main>
    </>
  );
} 