#!/usr/bin/env python3
"""
Rang E Renju Instagram scraper.

Logs in with provided credentials, fetches the N most recent posts from a
target Instagram profile, exports captions + media metadata to JSON, and
downloads the actual media files to ./ig_media/<shortcode>/.

Usage:
    python scripts/ig_scrape.py  [--posts 13] [--target rang_e_renju]
                                [--out scripts/ig_posts.json]
                                [--no-download] [--max-per-post 20]
"""
import argparse
import json
import os
import sys

import instaloader
from instaloader import Profile, instaloader as il

# Credentials (from user)
USERNAME = "varunvijay235og@gmail.com"
PASSWORDS = ["qwertY098765@@"]

SESSION_FILE = os.path.join(os.path.dirname(__file__), "ig_session_file")


def login(L: instaloader.Instaloader, sessionid: str = None) -> bool:
    # 0) Use a sessionid cookie if provided (bypasses password + 2FA + checkpoint)
    if sessionid:
        try:
            L.context._session.cookies.set("sessionid", sessionid, domain=".instagram.com")
            username = L.test_login()
            if not username:
                print("[session] Provided sessionid is invalid or expired.")
                return False
            L.context.username = username
            try:
                L.save_session_to_file(SESSION_FILE)
                print("[session] Saved working session from provided sessionid.")
            except Exception as e:
                print(f"[session] (session not saved: {e})")
            print(f"[session] Authenticated via sessionid as @{username}")
            return True
        except Exception as e:
            print(f"[session] sessionid login failed: {type(e).__name__}: {e}")
            return False

    # 1) Try loading an existing saved session first (avoids re-auth / rate limiting)
    if os.path.exists(SESSION_FILE):
        try:
            L.load_session_from_file(USERNAME, SESSION_FILE)
            print(f"[session] Loaded existing session for {USERNAME}")
            return True
        except Exception as e:
            print(f"[session] Could not load saved session: {e}")

    # 2) Fresh login with each password variant
    for idx, pw in enumerate(PASSWORDS, 1):
        try:
            L.login(USERNAME, pw)
            print(f"[login] Logged in with password variant {idx}")
            try:
                L.save_session_to_file(SESSION_FILE)
                print("[login] Session saved for reuse.")
            except Exception as e:
                print(f"[login] (session not saved: {e})")
            return True
        except il.BadCredentialsException as e:
            print(f"[login] Bad credentials for variant {idx}: {e}")
        except il.TwoFactorAuthRequiredException:
            print(f"[login] 2FA required for variant {idx} - I need the code to proceed.")
        except il.ConnectionException as e:
            print(f"[login] Connection error for variant {idx}: {e}")
        except il.InstaloaderException as e:
            print(f"[login] Login failed variant {idx}: {type(e).__name__}: {e}")
        except Exception as e:
            print(f"[login] Unexpected error variant {idx}: {type(e).__name__}: {e}")

    return False


def collect_media(post) -> list:
    """Return a list of media records for a single post."""
    media = []
    if post.typename == "GraphSidecar":
        try:
            for node in post.get_sidecar_nodes():
                rec = {
                    "display_url": node.display_url,
                    "is_video": node.is_video,
                    "video_url": node.video_url if node.is_video else None,
                }
                media.append(rec)
        except Exception as e:
            print(f"[warn] Could not expand sidecar for {post.shortcode}: {e}")
            media = [{"display_url": post.url, "is_video": False, "video_url": None}]
    else:
        media = [{
            "display_url": post.url,
            "is_video": post.is_video,
            "video_url": post.video_url if post.is_video else None,
        }]
    return media

def main() -> int:
    ap = argparse.ArgumentParser(description="Scrape Rang E Renju Instagram posts")
    ap.add_argument("--posts", type=int, default=13, help="Number of most-recent posts to scrape")
    ap.add_argument("--target", default="rang_e_renju", help="Target Instagram username")
    ap.add_argument("--out", default="scripts/ig_posts.json", help="Output JSON path")
    ap.add_argument("--no-download", action="store_true", help="Skip downloading media files")
    ap.add_argument("--max-per-post", type=int, default=20, help="Max media files per post to download")
    ap.add_argument("--sessionid", default=None, help="Instagram sessionid cookie (bypasses login/2FA)")
    ap.add_argument("--login-user", default=None, help="Username/email tied to the sessionid (defaults to scraper account)")
    args = ap.parse_args()
    global USERNAME
    if args.login_user:
        USERNAME = args.login_user

    L = instaloader.Instaloader(
        download_pictures=False,
        download_videos=False,
        download_video_thumbnails=False,
        save_metadata=False,
        compress_json=False,
        quiet=False,
    )

    if not login(L, args.sessionid):
        print("[fatal] Authentication failed. Check your credentials / handle 2FA manually.")
        return 1

    print(f"\n[target] Fetching up to {args.posts} posts from @{args.target} ...")
    try:
        profile = Profile.from_username(L.context, args.target)
    except il.ProfileNotExistsException:
        print(f"[fatal] Profile @{args.target} not found.")
        return 1
    except il.InstaloaderException as e:
        print(f"[fatal] Could not fetch profile: {type(e).__name__}: {e}")
        return 1

    print(f"  profile: {profile.full_name} | followers={profile.followers}")

    posts = []
    try:
        for i, post in enumerate(profile.get_posts()):
            if i >= args.posts:
                break
            media = collect_media(post)
            posts.append({
                "index": i + 1,
                "shortcode": post.shortcode,
                "url": f"https://www.instagram.com/p/{post.shortcode}/",
                "timestamp": post.date_utc.isoformat() if post.date_utc else None,
                "type": post.typename,
                "is_video": post.is_video,
                "likes": int(post.likes or 0),
                "comments": int(post.comments or 0),
                "caption": post.caption,
                "media": media,
            })
            print(f"  [{i+1}] {post.shortcode} ({post.typename}) media={len(media)}")
    except il.InstaloaderException as e:
        print(f"[warn] Stopped early after {len(posts)} posts: {e}")

    # Write JSON
    out_path = os.path.abspath(args.out)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
    print(f"\n[ok] Wrote {len(posts)} posts to {out_path}")

    # Download media
    if not args.no_download and posts:
        base_dir = os.path.join(os.path.dirname(out_path), "ig_media")
        os.makedirs(base_dir, exist_ok=True)
        session = L.context._session
        total = 0
        for p in posts:
            sc = p["shortcode"]
            dir_ = os.path.join(base_dir, sc)
            os.makedirs(dir_, exist_ok=True)
            for j, m in enumerate(p["media"], 1):
                if j > args.max_per_post:
                    break
                url = m.get("video_url") or m.get("display_url")
                if not url:
                    continue
                ext = ".mp4" if m.get("is_video") else ".jpg"
                fname = os.path.join(dir_, f"{j}{ext}")
                try:
                    r = session.get(url, timeout=30)
                    r.raise_for_status()
                    with open(fname, "wb") as fh:
                        fh.write(r.content)
                    total += 1
                except Exception as e:
                    print(f"  [warn] failed {sc}[{j}]: {e}")
            print(f"  [dl] {sc} -> {dir_}")
        print(f"[ok] Downloaded {total} media files into {os.path.abspath(base_dir)}")

    print("\nDone.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

