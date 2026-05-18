import random


def draw_omikuji():
    """Return one random fortune result and message."""
    fortunes = [
        ("大吉", "今日は新しいことを始めるのにぴったりです。小さく一歩進めてみましょう。"),
        ("中吉", "落ち着いて進めれば、ちゃんと良い方向に進みます。焦らなくて大丈夫です。"),
        ("小吉", "大きな変化より、目の前の作業をひとつ片付けると運が開けそうです。"),
        ("末吉", "今日は無理をしすぎず、準備を整える日にすると良さそうです。"),
    ]

    # random.choice は、リストの中からランダムに1つ選ぶ関数です。
    return random.choice(fortunes)


def main():
    print("=== Python おみくじ ===")
    print("Enterキーを押すと、おみくじを引きます。")

    while True:
        input("\nおみくじを引くには Enter を押してください...")

        result, message = draw_omikuji()
        print(f"\n結果: {result}")
        print(f"ひとこと: {message}")

        again = input("\nもう一度引きますか？ (y/n): ").strip().lower()

        # y または yes 以外なら、ここでループを終わります。
        if again not in ("y", "yes"):
            print("\nまた遊んでください。今日も良い一日を。")
            break


if __name__ == "__main__":
    main()
