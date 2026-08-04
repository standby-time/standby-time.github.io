"""提取每日一句中的所有唯一字符，用于字体子集化"""
import sys
import os

texts = [
    '任何足够先进的技术，都与魔法无异。',
    '代码胜于雄辩。',
    '第一要务是让程序跑起来，然后再谈优化。',
    '编程不是打字，是思考。',
    '优秀程序员的代码，是写给人看的，顺带能在机器上运行。',
    '简单是可靠的前提。',
    '你不需要理解所有东西才能开始，但一旦开始了，就去理解所有东西。',
    '计算机科学，归根结底是解决问题的艺术。',
    '写代码最好的方式，就是不要写多余的代码。',
    '技术会过时，但基础原理不会。',
    '学习一门新技术的最好方法，就是用它能做点什么出来。',
    'Bug是程序在告诉你：你以为你懂了，其实还没有。',
    '任何傻瓜都能写出计算机能懂的代码，好程序员写出人能懂的代码。',
    '不要害怕犯错，害怕的是不从错误中学习。',
    '将复杂问题拆解成简单步骤，这是程序员最核心的能力。',
    '读代码的时间远多于写代码的时间，让前者更容易。',
    '编程是一项将想法变为现实的超能力。',
    '好的命名胜过好的注释。',
    '理解计算机系统，是成为优秀工程师的必经之路。',
    '今天的努力，是明天的基石。',
    'Arthur C. Clarke Linus Torvalds Michael A. Jackson Rich Hickey Harold Abelson Edsger W. Dijkstra Standby-Time Donald Knuth Martin Fowler Guido van Rossum Randal E. Bryant',
]

all_chars = set()
for t in texts:
    for c in t:
        all_chars.add(c)

basic = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,;:!?-=_+()[]{}/\\|#"\'`@$%^&*~ '
for c in basic:
    all_chars.add(c)

chars_str = ''.join(sorted(all_chars))
out_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'fonts', 'daily-chars.txt')
os.makedirs(os.path.dirname(out_path), exist_ok=True)
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(chars_str)
print(f'唯一字符数: {len(all_chars)}')
print(f'写入: {out_path}')
