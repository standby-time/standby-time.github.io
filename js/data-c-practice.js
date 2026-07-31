/* ============================================================
 * data-c-practice.js — C 语言刷题数据
 * 由 scripts/sync-c-practice.js 自动生成，请勿手动编辑
 * 生成时间: 2026-07-31T12:34:11.446Z
 * 题目总数: 68
 * ============================================================ */

const cPracticeProblems = [
  {
    id: 1,
    title: '有 1、2、3、4 四个数字，能组成多少个互不相同且无重复数字的三位数？都是多少？',
    description: '',
    solutions: [
      {
        label: '',
        approach: '从百位数开始选择，然后十位数，个位数，分别为i,j,k.全部都可选1,2,3,4. 用for循环实现\n    要去掉不满足的情况：用if语句去掉有相同的情况，i==j,i==k,j==k的情况。\n    计数：设置一个count，在if语句中，每输出一个count+1.',
        code: '#include <stdio.h>\n\nint main() {\n    int i, j, k;\n    int count = 0;\n    for(i=1; i<5; i++) { // 百位数\n        for(j=1; j<5; j++) { // 十位数\n            for(k=1; k<5; k++) { // 个位数\n                if(i!=j && i!=k && j!=k) { // 去掉相同的情况\n                    printf("%d,%d,%d \\n", i, j, k);\n                    count++; // 输出一个计数+1\n                }\n            }\n        }\n    }\n    printf("能够组成%d个互不相同的三位数 \\n", count);\n}',
        fileName: 'ex1.c'
      }
    ]
  },
  {
    id: 2,
    title: '企业发放的奖金根据利润提成',
    description: '利润(I)低于或等于10万元时，奖金可提10%；\n利润高于10万元，低于20万元时，低于10万元的部分按10%提成，高于10万元的部分，可提成7.5%；\n20万到40万之间时，高于20万元的部分，可提成5%；\n40万到60万之间时高于40万元的部分，可提成3%；\n60万到100万之间时，高于60万元的部分，可提成1.5%；\n高于100万元时，超过100万元的部分按1%提成。\n从键盘输入当月利润I，求应发放奖金总数？',
    solutions: [
      {
        label: '',
        approach: '假设利润为i，\n    - 从键盘中读取i；\n    - 最终奖金总数在bonus中，初始值为0；\n        - 每一阶段设置一个奖金上限方便逐阶递加简单计算：\n            - bonus1, bonus2, bonus3,bonus4, bonus5;\n            - bonus1 = 100000 * 0.1;\n            - bonus2 = bonus1 + 100000 * 0.075;\n            - bonus3 = bonus2 + 200000 * 0.05;\n            - bonus4 = bonus3 + 200000 * 0.03;\n            - bonus5 = bonus4 + 400000 * 0.015;\n        - 如果 i<100000，则 bonus = i * 0.1;\n        - 如果 100000<=i<=200000,则 bonus = bonus1 + (i-100000) * 0.075;\n        - 如果 200000<=i<=400000,则 bonus = bonus2 + (i-200000) * 0.05;\n        - 如果 400000<=i<=600000,则 bonus = bonus3 + (i-400000) * 0.03;\n        - 如果 600000<=i<=1000000,则 bonus = bonus4 + (i-600000) * 0.015;\n        - 如果 i>1000000,则 bonus = bonus5 + (i-1000000) * 0.01;\n        - 用if-else if来逐步实现\n\n注意：用双精度浮点型double',
        code: '#include <stdio.h>\n\nint main() {\n    double i; // 利润\n    double bonus=0; // 最终奖金\n    double bonus1, bonus2, bonus3, bonus4, bonus5; // 每阶段奖金\n    printf("你的月利润是： \\n");\n    scanf("%lf", &i); // 读取利润\n    \n    // 计算每一阶段奖金\n    bonus1 = 100000 * 0.1;\n    bonus2 = bonus1 + 100000 * 0.075;\n    bonus3 = bonus2 + 200000 * 0.05;\n    bonus4 = bonus3 + 200000 * 0.03;\n    bonus5 = bonus4 + 400000 * 0.015;\n\n    // 计算最终奖金\n    if (i<=100000) {\n        bonus = i * 0.1;\n    } else if(i<=200000) {\n        bonus = bonus1 + (i-100000) * 0.075;\n    } else if(i<=400000) {\n        bonus = bonus2 + (i-200000) * 0.05;\n    } else if(i<=600000) {\n        bonus = bonus3 + (i-400000) * 0.03;\n    } else if(i<=1000000) {\n        bonus = bonus4 + (i-600000) * 0.015;\n    } else if(i>1000000) {\n        bonus = bonus5 + (i-1000000) * 0.01;\n    }\n    \n    printf("应发放的奖金总数为：bonus = %lf\\n", bonus);\n\n    return 0;\n}',
        fileName: 'ex2.c'
      }
    ]
  },
  {
    id: 3,
    title: '一个整数，它加上100后是一个完全平方数，再加上168又是一个完全平方数，请问该数是多少？',
    description: '',
    solutions: [
      {
        label: '方法一',
        approach: '设这个整数为x;\n    - 加上100是完全平方数：x + 100 = m^2;\n    - 再加上168又是完全平方数：x + 100 + 168 = n^2;\n    - 两式合并：n^2 - m^2 = 168;\n    - 解方程：n^2 - m^2 = (n+m)(n-m) = 168;\n    - 设置i,j：i = n+m, j = n-m; 则 i*j = 168;\n    - 代入可得：n = (i+j)/2, m = (i-j)/2;\n    \n    - 由n,m都是整数可知：i,j都是整数;\n    - 由n,m都是正数(完全平方根)且m<n可知：i>j>0;\n    \n    - 关于i,j的奇偶性：\n        - i+j = (n+m)+(n-m) = 2n   => 偶数\n        - i-j = (n+m)-(n-m) = 2m   => 偶数\n        - 可得：i,j同奇同偶;\n        - 根据i*j=168可知：i,j同为偶数;\n\n    - 确定范围:\n        - 由 (1)i*j=168, (2)i,j同为偶数, (3)i>j>0 可知：j>=2, 且i = 168/j <= 168/2=84;\n        - 故范围为：2 <= i <= 84, j >= 2;\n\n    - 由i,j的值往回退找到x：\n        - 由(1)n=(i+j)/2, m=(i-j)/2,  (2)x=m^2-100;',
        code: '#include <stdio.h>\n\nint main(){\n    int x;\n    int m, n;\n    int i, j;\n    int count=0;\n\n    for(i=2; i<=84; i=i+2){ // i是从2开始的偶数\n        if(168%i == 0){ // i能够被168整除(根据i*j=168)\n            j = 168/i;\n            if(j>=2 && i>j && (i+j)%2==0){\n                // 计算m,n\n                m = (i-j) / 2;\n                n = (i+j) / 2;\n                //计算x\n                x = m*m - 100;\n                count++;\n                printf("第%d个数是：%d \\n", count, x);\n                printf("%d + 100 = %d * %d \\n", x, m, m);\n                printf("%d + 100 + 168 = %d * %d \\n", x, n, n);\n                printf("\\n");\n            }\n        }\n    }\n\n    return 0;\n}',
        fileName: 'ex3.c'
      },
      {
        label: '方法二',
        approach: '- 设这个数是x;\n    - 在x的取值范围中遍历，判断每一个x是不是符合条件;\n    - 难点是要确定x的范围;\n    - 由题可知： x + 100 = m^2, x + 100 + 168 = n^2;\n    - 由x + 100 = m^2 可知：x>=-100;\n    - n^2 - m^2 =168, 当m增大时，n也增大，n和m越来越接近;\n\n    - 找出最大的m：\n        - 设n = m + 1; (这是n比m大的最小整数差)\n        - 那么(m+1)^2 - m^2 = 168;\n        - 计算得：m = 83.5;\n        - 所以在 m>83 的时候，不管n取多少，都不能满足n^2-m^2=168;\n            - 解释：当m=84时，n=85，n^2-m^2=169，大于168;\n            - 所以，其他的n 的取值都不会再满足n^2-m^2=168;\n        - 最终取得最大的m为83;\n\n    - 根据最大的m，可以找到x的上界：\n        - 当m=84时，x = 84*84 - 100 = 6956;\n\n    - 最终得到x的范围是[-100, 6956];',
        code: '#include <stdio.h>\n#include <math.h> // 包含头文件math.h，里面有sqrt()函数\n\nint main(){\n    int x;\n    int count = 0;\n\n    for(x=-100; x<=6956; x++){\n        int m = sqrt(x + 100); // 计算x + 100的平方根m\n        int n = sqrt(x + 100 + 168); // 计算x + 100 + 168的平方根n\n        // sqrt()函数返回一个double型的平方根;\n        // 在这里强制转换为int类型，出现截断取整;\n        // 只有正好是整数的平方根没有变化，在后面的判断中可以返回计算出正确的数值;\n\n        // 检查判断是否是完全平方\n        if(m*m == x + 100 && n*n == x + 100 + 168){\n            count++;\n            printf("第%d个数是：%d \\n", count, x);\n            printf("%d + 100 = %d * %d \\n", x, m, m);\n            printf("%d + 100 + 168 = %d * %d \\n", x, n, n);\n            printf("\\n");\n        }\n    }\n\n    return 0;\n}',
        fileName: 'ex3_2.c'
      },
      {
        label: '方法三',
        approach: '- 设这个数是x;\n    - 设x + 100 = m^2, x + 100 + 168 = n^2;\n    - 因为是完全平方数，所以必须满足 n>m>0;\n\n    - 找出最大的m：\n        - 设n = m + 1; (这是n比m大的最小整数差)\n        - 那么(m+1)^2 - m^2 = 168;\n        - 计算得：m = 83.5;\n        - 所以在 m>83 的时候，不管n取多少，都不能满足n^2-m^2=168;\n            - 解释：当m=84时，n=85，n^2-m^2=169，大于168;\n            - 所以，其他的n 的取值都不会再满足n^2-m^2=168;\n        - 最终取得最大的m为83;\n\n    - 故m的取值范围是[0,83];\n\n    - 通过遍历m，然后计算n并取平方根作比较来判断x是否满足条件;',
        code: '#include <stdio.h>\n#include <math.h>\n\nint main(){\n    int x;\n    int m, n;\n    int count = 0;\n\n    for(m=0; m<84; m++){\n        int temp = m*m + 168; // n^2 = m^2 + 168\n        int n = sqrt(m*m + 168); // 计算n的平方根\n        \n        if(n*n == temp){ // 判断是否为完全平方\n            count++;\n            x = m*m - 100;\n            printf("第%d个数是：%d \\n", count, x);\n            printf("%d + 100 = %d * %d \\n", x, m, m);\n            printf("%d + 100 + 168 = %d * %d \\n", x, n, n);\n            printf("\\n");\n        }\n    }\n\n    return 0;\n}',
        fileName: 'ex3_3.c'
      }
    ]
  },
  {
    id: 4,
    title: '输入某年某月某日，判断这一天是这一年的第几天？',
    description: '',
    solutions: [
      {
        label: '方法一',
        approach: '对于输入的日期要设置为year, month, day.\n    - 首先判断是否为闰年：(两个条件满足一个)\n        - (1) 能被4整除，但不能被100整除;\n        - (2) 能被400整除.\n    - 设置一个元素来判断是否为闰年;    \n    \n    - 用一个数组来存储每个月的天数(非闰年的)；\n    - 注意对于闰年的情况要修改2月份的天数：\n\n    - 计算这一年的第几天:\n        - 把前面几个月的日期加起来然后加上这个月的;\n        - 可以用一个for循环来加前几个月的日期;',
        code: '#include <stdio.h>\n\nint main(){\n    int year, month, day;\n    int is_leap_year = 0; // 0表示不是闰年，1表示是闰年\n\n    printf("请输入年份、月份和日期（格式：年 月 日）：");\n    scanf("%d %d %d", &year, &month, &day);\n\n    // 使用数组来存储每个月的天数\n    int days_of_month[] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};\n\n    // 判断是否为闰年\n    if(((year % 4 == 0) && (year % 100 != 0)) || (year % 400 ==0)){\n        is_leap_year = 1;\n        days_of_month[1] = 29; // 2月份的天数为29\n    }\n\n    // 计算是这一年的第几天\n    int total_days = 0;\n    // 先加前几个月的天数\n    for(int i=0; i<month-1; i++){\n        total_days = total_days + days_of_month[i];\n    }\n    // 加上这个月的天数\n    total_days = total_days + day;\n\n    printf("%d年%d月%d日是该年的第%d天\\n", year, month, day, total_days);\n\n    return 0;\n}',
        fileName: 'ex4.c'
      },
      {
        label: '方法二',
        approach: '- 在读取到年月日后加一个判断，判断日期是否有效;\n        - 年份不能为负;\n        - 月份是否在1-12之间;\n        - 日期是否在该月范围内;',
        code: '#include <stdio.h>\n\nint main(){\n    int year, month, day;\n    int is_leap_year = 0; // 0表示不是闰年，1表示是闰年\n\n    printf("请输入年份、月份和日期（格式：年 月 日）：");\n    scanf("%d %d %d", &year, &month, &day);\n\n    // 判断年份是否有效\n    if(year < 0){\n        printf("输入无效，年份 %d 无效！年份必须在1-12之间，请输入正确的年份、月份和日期。\\n", year);\n        return 1; // 返回非0值表示程序异常结束\n    }\n    // 判断月份是否有效\n    if(month < 1 || month > 12){\n        printf("输入无效，月份 %d 无效！月份必须在1-12之间，请输入正确的年份、月份和日期。\\n", month);\n        return 1;\n    }\n\n    // 使用数组来存储每个月的天数\n    int days_of_month[] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};\n\n    // 判断是否为闰年\n    if(((year % 4 == 0) && (year % 100 != 0)) || (year % 400 ==0)){\n        is_leap_year = 1;\n        days_of_month[1] = 29; // 2月份的天数为29\n    }\n\n    // 判断日期是否有效\n    if(day < 1 || day > days_of_month[month-1]){\n        printf("输入无效，日期 %d 无效！日期必须在1-%d之间，请输入正确的年份、月份和日期。\\n", day, days_of_month[month-1]);\n        return 1;\n    }\n\n    // 计算是这一年的第几天\n    int total_days = 0;\n    // 先加前几个月的天数\n    for(int i=0; i<month-1; i++){\n        total_days = total_days + days_of_month[i];\n    }\n    // 加上这个月的天数\n    total_days = total_days + day;\n\n    printf("%d年%d月%d日是该年的第%d天\\n", year, month, day, total_days);\n\n    return 0;\n}',
        fileName: 'ex4_2.c'
      },
      {
        label: '方法三',
        approach: '- 把对于闰年的判断逻辑封装成函数',
        code: '#include <stdio.h>\n\n// 判断是否为闰年\nint isLeapYear(int year){\n    if(((year % 4 == 0) && (year % 100 != 0)) || (year % 400 ==0)){\n        return 1; // 是闰年\n    }\n    return 0; // 不是闰年\n}\n\nint main(){\n    int year, month, day;\n    int is_leap_year = 0;\n\n    printf("请输入年份、月份和日期（格式：年 月 日）：");\n    scanf("%d %d %d", &year, &month, &day);\n\n    // 使用数组来存储每个月的天数\n    int days_of_month[] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};\n\n    // 调用函数判断是否为闰年\n    is_leap_year = isLeapYear(year);\n\n    // 处理闰年2月的天数\n    if(is_leap_year){\n        days_of_month[1] = 29;\n    }\n\n    // 计算是这一年的第几天\n    int total_days = 0;\n    // 先加前几个月的天数\n    for(int i=0; i<month-1; i++){\n        total_days = total_days + days_of_month[i];\n    }\n    // 加上这个月的天数\n    total_days = total_days + day;\n\n    printf("%d年%d月%d日是该年的第%d天\\n", year, month, day, total_days);\n\n    return 0;\n}',
        fileName: 'ex4_3.c'
      }
    ]
  },
  {
    id: 5,
    title: '输入三个整数 x、y、z，请把这三个数由小到大输出',
    description: '',
    solutions: [
      {
        label: '',
        approach: '- 按照xy,xz,yz的顺序进行比较;\n    - 每一次比较，如果前大后小就交换位置;',
        code: '#include <stdio.h>\n\nint main(){\n    int x, y, z;\n    int temp; // 用于交换\n\n    printf("请输入三个数字（格式是：x y z）： ");\n    scanf("%d %d %d", &x, &y, &z);\n\n    if(x > y){\n        temp = x;\n        x = y;\n        y = temp;\n    }\n\n    if(x > z){\n        temp = x;\n        x = z;\n        z = temp;\n    }\n\n    if(y > z){\n        temp = y;\n        y = z;\n        z = temp;\n    }\n\n    printf("从小到大排序：%d %d %d\\n", x, y, z);\n\n    return 0;\n}',
        fileName: 'ex5.c'
      }
    ]
  },
  {
    id: 6,
    title: '用*号输出字母C的图案',
    description: '',
    solutions: [
      {
        label: '',
        approach: '基本形状是：\n    - *****\n    - *\n    - *\n    - *****',
        code: '#include <stdio.h>\n\nint main(){\n    printf("用*号输出字母C的图案: \\n");\n    printf("****** \\n");\n    printf("* \\n");\n    printf("* \\n");\n    printf("****** \\n");\n    return 0;\n}',
        fileName: 'ex6.c'
      }
    ]
  },
  {
    id: 7,
    title: 'ex7',
    description: '',
    solutions: [
      {
        label: '',
        approach: '',
        code: '#include <stdio.h>\n#include <windows.h>\n\n#include<stdio.h>\nint main()\n{\n    char a=176,b=219;\n    printf("%c%c%c%c%c\\n",b,a,a,a,b);\n    printf("%c%c%c%c%c\\n",a,b,a,b,a);\n    printf("%c%c%c%c%c\\n",a,a,b,a,a);\n    printf("%c%c%c%c%c\\n",a,b,a,b,a);\n    printf("%c%c%c%c%c\\n",b,a,a,a,b);\n    return 0;\n}',
        fileName: 'ex7.c'
      }
    ]
  },
  {
    id: 8,
    title: '输出 9*9 口诀',
    description: '',
    solutions: [
      {
        label: '',
        approach: '- i控制行，j控制列;\n    - i为外循环，j为内循环;',
        code: '#include <stdio.h>\n\nint main(){\n    int i, j;\n    int result;\n\n    printf("\\n"); // 控制换行\n    printf("九九乘法表：\\n");\n    for(i=1; i<10; i++){\n        for(j=1; j<=i; j++){\n            result = i * j;\n            printf("%d*%d=%-3d", i, j, result);\n        }\n        printf("\\n");\n    }\n\n    return 0;\n}',
        fileName: 'ex8.c'
      }
    ]
  },
  {
    id: 11,
    title: '古典问题（兔子生崽）：有一对兔子，从出生后第3个月起每个月都生一对兔子，小兔子长到第三个月后每个月又生一对兔子，假如兔子都不死，问每个月的兔子总数为多少？（输出前40个月即可）',
    description: '',
    solutions: [
      {
        label: '方法一',
        approach: '兔子对数遵循斐波那契数列\n    - 规律是：从第3个月开始，每个月的兔子对数=前两个月兔子对数之和;\n    - 数列：1, 1, 2, 3, 5, 8, 13, 21, 34, 55...\n\n    - 用一个数组来存储每个月的兔子对数;\n    - 通过循环计算每个月的兔子对数;\n    - 从第3个月开始：rabbit[i] = rabbit[i-1] + rabbit[i-2];',
        code: '#include <stdio.h>\n\nint main(){\n    long long rabbit[40]; // 用long long防止数值溢出\n    int i;\n\n    // 初始化前两个月的兔子对数\n    rabbit[0] = 1;\n    rabbit[1] = 1;\n\n    // 计算后面的兔子对数\n    for(i=2; i<40; i++){\n        rabbit[i] = rabbit[i-1] + rabbit[i-2];\n    }\n\n    printf("月份\\t兔子对数\\n");\n    printf("=================\\n");\n    for(i=0; i<40; i++){\n        printf("%2d月\\t%lld\\n", i+1, rabbit[i]);\n\n        if((i+1) % 10 == 0){\n            printf("-----------------\\n"); // 每十个月划分一下方便看\n        }\n    }\n\n    return 0;\n}',
        fileName: 'ex11.c'
      },
      {
        label: '方法二',
        approach: '兔子对数遵循斐波那契数列\n    - 规律是：从第3个月开始，每个月的兔子对数=前两个月兔子对数之和;\n    - 数列：1, 1, 2, 3, 5, 8, 13, 21, 34, 55...\n\n    - 不用数组，直接用变量来表示;\n    - 用循环计算每个月的兔子对数，随时更新;',
        code: '#include <stdio.h>\n\nint main(){\n    long long rabbit1, rabbit2, rabbit;\n    int i;\n\n    // 初始前两个月的值\n    rabbit1 = 1;\n    rabbit2 = 1;\n\n    printf("月份\\t兔子对数\\n");\n    printf("=================\\n");\n\n    printf(" 1月\\t%lld\\n",rabbit1);\n    printf(" 2月\\t%lld\\n",rabbit2);\n\n    // 循环计算后面的月份\n    for(i=3; i<=40; i++){\n        rabbit = rabbit1 + rabbit2;\n        printf("%2d月\\t%lld\\n", i, rabbit);\n\n        // 更新前两个月的值\n        rabbit1 = rabbit2;\n        rabbit2 = rabbit;\n\n        if(i % 10 == 0){\n            printf("-----------------\\n");\n        }\n    }\n\n    return 0;\n}',
        fileName: 'ex11_2.c'
      },
      {
        label: '方法三',
        approach: '兔子对数遵循斐波那契数列\n    - 规律是：从第3个月开始，每个月的兔子对数=前两个月兔子对数之和;\n    - 数列：1, 1, 2, 3, 5, 8, 13, 21, 34, 55...\n\n    - 单独斐波那契递归函数来计算;',
        code: '#include <stdio.h>\n\n// 递归函数计算斐波那契数列\nlong long fibonacci(int n) {\n    if(n == 1 | n == 2){\n        return 1;\n    }else{\n        return fibonacci(n-1) + fibonacci(n-2);\n    }\n}\n\nint main(){\n    int i;\n\n    printf("月份\\t兔子对数\\n");\n    printf("=================\\n");\n\n    for(i=1; i<=40; i++){\n        printf("%2d月\\t%lld\\n", i, fibonacci(i));\n\n        if(i % 10 == 0){\n            printf("-----------------\\n");\n        }\n    }\n\n    return 0;\n}',
        fileName: 'ex11_3.c'
      }
    ]
  },
  {
    id: 12,
    title: '判断 101 到 200 之间的素数',
    description: '',
    solutions: [
      {
        label: '方法一',
        approach: '判断素数：\n    - 对于一个数n，检查从2到根号下n之间的整数是否能整除n;\n    - 如果能整除，则n不是素数;\n    - 如果不能整除，则n是素数。',
        code: '# include <stdio.h>\n#include <math.h>\n\nint main(){\n    int i, j;\n    int count = 0; // 记录素数的个数\n\n    for(i=101; i<=200; i++){\n        int isPrime = 1; // 假设i是素数, 1表示是素数, 0表示不是素数\n        \n        for(j=2; j<=sqrt(i); j++){\n            if(i % j == 0){\n                isPrime = 0; // i不是素数\n                break; // 跳出循环\n            }\n        }\n\n        if(isPrime == 1){\n            printf("%d ", i);\n            count++; // 记录素数的个数\n\n            // 每输出5个换行\n            if(count % 5 == 0){\n                printf("\\n"); \n            }\n        }\n    }\n\n    printf("\\n共有%d个素数\\n", count);\n\n    return 0;\n}',
        fileName: 'ex12.c'
      },
      {
        label: '方法二',
        approach: '判断素数：\n    - 对于一个数n，检查从2到根号下n之间的整数是否能整除n;\n    - 如果能整除，则n不是素数;\n    - 如果不能整除，则n是素数。\n\n    - 单独封装一个函数用于判断素数',
        code: '#include <stdio.h>\n#include <math.h>\n\n// 判断是否为素数\n// 封装成函数\n// 返回值：1表示是素数，0表示不是素数\nint isPrime(int n){\n    if(n < 2) return 0; // 1不是素数\n    if(n == 2) return 1; // 2是素数\n    if(n % 2 == 0) return 0; //除了2以外的偶数都不是素数\n\n    int limit = sqrt(n); // 计算根号下n\n\n    // 只检查奇数因子\n    for(int i=3; i<=limit; i=i+2){\n        if(n % i == 0){\n            return 0; // 能被整除，不是素数\n        }\n    }\n\n    return 1; //是素数\n}\n\nint main(){\n    int count = 0;\n\n    printf("101到200之间的素数有：\\n");\n\n    for(int num=101; num<=200; num++){\n        if(isPrime(num)){\n            printf("%d ", num);\n            count++;\n\n            // 每输出5个数换行\n            if(count % 5 == 0){\n                printf("\\n");\n            }\n        }\n    }\n\n    printf("\\n共有%d个素数\\n", count);\n\n    return 0;\n}',
        fileName: 'ex12_2.c'
      }
    ]
  },
  {
    id: 13,
    title: '打印出所有的"水仙花数"，所谓"水仙花数"是指一个三位数，其各位数字立方和等于该数本身',
    description: '例如：153是一个"水仙花数"，因为153=1的三次方＋5的三次方＋3的三次方。',
    solutions: [
      {
        label: '方法一',
        approach: '水仙花数：\n    - 一个三位数abc;\n    - a^3 + b^3 + c^3 = abc;\n\n    - 三位数限制范围：100~999;\n    - 循环遍历每一个数;\n    - 循环过程中，拆解每一个数为个位、十位、百位;\n    - 计算个位、十位、百位的立方和;\n    - 判断立方和是否等于该数本身;',
        code: '# include <stdio.h>\n\nint main(){\n    int i;\n    int a, b, c;\n\n    printf("所有的水仙花数：\\n");\n\n    for(i=100; i<1000; i++){\n        // 拆解每一个数为个位、十位、百位\n        a = i % 10; // 个位\n        b = (i / 10) % 10; // 十位\n        c = (i / 100) % 10; // 百位\n\n        // 计算个位、十位、百位的立方和\n        int sum = a*a*a + b*b*b + c*c*c;\n\n        // 判断立方和是否等于该数本身\n        if(sum == i){\n            printf("%d\\n", i);\n        }\n    }\n\n    return 0;\n}',
        fileName: 'ex13.c'
      },
      {
        label: '方法二',
        approach: '水仙花数：\n    - 一个三位数abc;\n    - a^3 + b^3 + c^3 = abc;\n\n    - 单独封装一个函数判断是否为水仙花数;\n    - 三位数限制范围：100~999;\n    - 判断是否在范围内;\n    - 拆解每一个数为个位、十位、百位;\n    - 如果个位、十位、百位的立方和为该数本身，则该数为水仙花数;',
        code: '#include <stdio.h>\n\n// 判断是否为水仙花数\nint is_narcissistic(int num){\n    if(num < 100 || num > 999){\n        return 0; // 超出范围\n    }\n\n    int a = num % 10; // 个位\n    int b = (num / 10) % 10; // 十位\n    int c = (num / 100) % 10; // 百位\n\n    int sum = a*a*a + b*b*b + c*c*c;\n\n    if(sum == num){\n        return 1; // 是水仙花数\n    }\n\n    return 0;\n}\n\nint main(){\n    int count = 0;\n\n    printf("所有的水仙花数：\\n");\n\n    for(int num=100; num<1000; num++){\n        if(is_narcissistic(num)){\n            printf("%d\\n", num);\n            count++;\n        }\n    }\n\n    printf("\\n共有%d个水仙花数\\n", count);\n\n    return 0;\n}',
        fileName: 'ex13_2.c'
      }
    ]
  },
  {
    id: 14,
    title: '将一个正整数分解质因数',
    description: '例如：输入 90,打印出 90=2*3*3*5。',
    solutions: [
      {
        label: '',
        approach: '找质因数\n    - 从最小的质数2开始，只要能整除n就打印;\n    - 然后更新n，再继续找下一个质数;\n    - 一直到n为1，打印出结果。',
        code: '#include <stdio.h>\n\nint main(){\n    int n;\n    int i = 2; // 从最小的质数2开始\n\n    printf("请输入一个正整数：");\n    scanf("%d", &n);\n\n    if(n == 1){\n        printf("%d 无法分解质因数。\\n", n);\n        return 0;\n    }\n\n    printf("%d = ", n);\n\n    // 分解质因数\n    while(n > 1){\n        // 如果n能被i整除，则打印i，并更新n\n        if(n % i == 0){\n            printf("%d", i);\n            n = n / i; // 更新n\n\n            // 如果n不是1，则继续分解质因数\n            if(n > 1){\n                printf(" * ");\n            }\n        }else{\n            // 如果n不能被i整除，则更新i\n            i++;\n        }\n    }\n\n    printf("\\n");\n\n    return 0;\n}',
        fileName: 'ex14.c'
      }
    ]
  },
  {
    id: 15,
    title: '利用条件运算符的嵌套来完成此题：学习成绩>=90分的同学用A表示，60-89分之间的用B表示，60分以下的用C表示',
    description: '',
    solutions: [
      {
        label: '方法一',
        approach: '用条件运算符来判断\n    - 条件运算符（三目运算符）\n        - 语法：(条件表达式)? 表达式1 : 表达式2\n        - 如果条件为真，执行表达式1;\n        - 如果条件为假，执行表达式2;',
        code: '#include <stdio.h>\n\nint main(){\n    int score;\n    char grade; // 定义变量grade，用于存放最终的等级\n\n    printf("请输入学生的成绩（0-100）： ");\n    scanf("%d", &score);\n\n    grade = (score >= 90) ? \'A\' : // A表示学习成绩>=90分的同学\n            (score >= 60 && score < 90) ? \'B\' : // B表示60-89分之间的同学\n            \'C\'; // C表示60分以下的同学\n\n    printf("学生的等级是：%c\\n", grade);\n\n    return 0;\n}',
        fileName: 'ex15.c'
      },
      {
        label: '方法二',
        approach: '直接在printf中使用条件运算符',
        code: '#include <stdio.h>\n\nint main(){\n    int score;\n\n    printf("请输入学生的成绩（0-100）： ");\n    scanf("%d", &score);\n\n    printf("学生的等级是：");\n\n    // 直接在printf中使用条件运算符\n    (score >= 90) ? printf("A\\n") :\n    (score >= 60) ? printf("B\\n") :\n    printf("C\\n");\n\n    return 0;\n}',
        fileName: 'ex15_2.c'
      }
    ]
  },
  {
    id: 16,
    title: '输入两个正整数m和n，求其最大公约数和最小公倍数',
    description: '',
    solutions: [
      {
        label: '',
        approach: '两个数的最小公倍数(LCM)*最大公约数(GCD)=两数的乘积\n    - 运用辗转相除法求最大公约数：\n        - 用较大数除以较小数，得到余数;\n        - 用较小数除以余数，再得到新的余数;\n        - 重复这个过程，直至余数为0;\n        - 最后的除数为最大公约数',
        code: '#include <stdio.h>\n\nint main(){\n    int m, n;\n    int gcd, lcm; // 最大公约数和最小公倍数\n\n    printf("请输入两个正整数m和n（格式为m n）： ");\n    scanf("%d %d", &m, &n);\n\n    // 验证一下输入的数是否正确\n    if(m <= 0 || n <= 0){\n        printf("输入的数必须是正整数！\\n");\n        return 1;\n    }\n\n    // 辗转相除法求最大公约数\n    /*\n    一个例子：\n    m = 48, n = 18\n    48 / 18 = 2 余 12\n    18 / 12 = 1 余 6\n    12 / 6 = 2 余 0\n    所以最大公约数为6\n    */\n    int a = m;\n    int b = n;\n    int r; // 余数\n\n    if(a < b){ // 确保a >= b\n        int temp = a;\n        a = b;\n        b = temp;\n    }\n\n    while(b != 0){\n        r = a % b; // 求余数\n        a = b; // 除数变成被除数\n        b = r; // 余数变成被除数\n    }\n\n    gcd = a; // 最大公约数\n    lcm = (m * n) / gcd; // 最小公倍数\n\n    printf("最大公约数为：%d\\n", gcd);\n    printf("最小公倍数为：%d\\n", lcm);\n\n    return 0;\n}',
        fileName: 'ex16.c'
      }
    ]
  },
  {
    id: 17,
    title: '输入一行字符，分别统计出其中英文字母、空格、数字和其它字符的个数',
    description: '',
    solutions: [
      {
        label: '方法一',
        approach: '用getchar()函数和while循环实现\n    - 统计：\n        - 英文字母letter，包括大写字母（A-Z）和小写字母（a-z）;\n        - 空格space，包括空格符（\' \'）;\n        - 数字digit，包括0-9;\n        - 其他other，包括除上述字符以外的其它字符。',
        code: '#include <stdio.h>\n\nint main(){\n    int letter = 0;\n    int space = 0;\n    int digit = 0;\n    int other = 0;\n    char c;\n\n    printf("请输入一行字符(按回车结束)：\\n");\n\n    // 逐个读取字符，直到输入结束\n    while((c = getchar()) != \'\\n\'){\n        if((c >= \'A\' && c <= \'Z\') || (c >= \'a\' && c <= \'z\')){\n            letter++; // 统计英文字母\n        }\n        else if(c >= \'0\' && c <= \'9\'){\n            digit++; // 统计数字\n        }\n        else if(c == \' \'){\n            space++; // 统计空格\n        }\n        else{\n            other++; // 统计其他字符\n        }\n    }\n\n    printf("统计结果：字母=%d，空格=%d，数字=%d，其他=%d\\n",letter, space, digit, other);\n\n    return 0;\n}',
        fileName: 'ex17.c'
      },
      {
        label: '方法二',
        approach: '用getchar()函数和字符分类函数实现\n    - 统计：\n        - 英文字母letter，包括大写字母（A-Z）和小写字母（a-z）;\n        - 空格space，包括空格符（\' \'）;\n        - 数字digit，包括0-9;\n        - 其他other，包括除上述字符以外的其它字符。',
        code: '#include <stdio.h>\n#include <ctype.h>  // 使用标准库函数\n\nint main() {\n    int letter = 0;\n    int space = 0;\n    int digit = 0;\n    int other = 0;\n    char c;\n\n    printf("请输入一行字符(按回车结束)：\\n");\n\n    while((c = getchar()) != \'\\n\') {\n        if(isalpha(c)) {          // 判断字母（包括大小写）\n            letter++;\n        } else if(isdigit(c)) {   // 判断数字\n            digit++;\n        } else if(isspace(c)) {   // 判断空白字符\n            space++;              // 注意：isspace包括空格、制表符等\n        } else {\n            other++;\n        }\n    }\n\n    printf("统计结果：字母=%d，空格=%d，数字=%d，其他=%d\\n", letter, space, digit, other);\n\n    return 0;\n}',
        fileName: 'ex17_2.c'
      }
    ]
  },
  {
    id: 18,
    title: '求 s=a+aa+aaa+aaaa+aa...a 的值，其中 a 是一个数字，例如 2+22+222+2222+22222 (此时共有5个数相加)，几个数相加有键盘控制',
    description: '',
    solutions: [
      {
        label: '',
        approach: '要有两个数a和n，其中n表示相加的数的个数\n    - 使用循环累加求每一项;\n    - 规律是：term(k) = term(k-1) * 10 + a, 其中term(1) = a;\n    - 每求出一项就在最终结果中加一项',
        code: '#include <stdio.h>\n\nint main(){\n    int a, n;\n    long long term = 0; // 当前项\n    long long sum = 0; // 最终结果\n\n    printf("请输入一个数字a和一个整数n（格式是a n）：");\n    scanf("%d %d", &a, &n);\n\n    // 验证输入是否合法\n    if(a < 0 || n > 9){\n        printf("输入错误！a必须是0-9之间的数字！\\n");\n        return 1;\n    }\n    if(n <= 0){\n        printf("输入错误！n必须是正整数！\\n");\n        return 1;\n    }\n\n    printf("计算过程：\\n");\n\n    for(int i=1; i<=n; i++){\n        term = term * 10 + a; // 计算当前项\n        sum = sum + term; // 累加结果\n        printf("第%d项：%lld\\n", i, term); // 输出当前项\n    }\n\n    printf("\\n最终结果是：%lld\\n", sum);\n\n    return 0;\n}',
        fileName: 'ex18.c'
      }
    ]
  },
  {
    id: 19,
    title: '一个数如果恰好等于它的因子之和，这个数就称为"完数"，例如 6=1＋2＋3 ，请编程找出 1000 以内的所有完数',
    description: '',
    solutions: [
      {
        label: '',
        approach: '对于每个数n（1-1000）\n    - 找出所有的真因子（不包括n本身）;\n    - 计算这些因子的和;\n    - 如果和等于n，则输出n;\n    - 寻找因子只需要找到',
        code: '#include <stdio.h>\n\nint main(){\n    int n;\n    int count;\n    int sum;\n\n    printf("1000以内的完数有：\\n");\n\n    for(n=1; n<=1000; n++){\n        sum = 0;\n\n        // 找出所有因子并求和\n        for(int i=1; i<n; i++){\n            if(n % i == 0){\n                sum = sum + i;\n            }\n        }\n\n        // 如果和等于n，则输出n\n        if(sum == n){\n            count++;\n            printf("%d = 1", n); // 1一定是第一项\n\n            // 输出因子\n            for(int j=2; j<n; j++){ // 从2开始，避开考虑第一项的问题\n                if(n % j == 0){\n                    printf(" + %d", j);\n                }\n            }\n\n            printf("\\n");\n        }\n    }\n\n    return 0;\n}',
        fileName: 'ex19.c'
      }
    ]
  },
  {
    id: 20,
    title: '一球从100米高度自由落下，每次落地后反跳回原高度的一半；',
    description: '再落下，求它在第10次落地时，共经过多少米？第10次反弹多高？',
    solutions: [
      {
        label: '',
        approach: '用循环实现，每一次落地更新高度，并计算经过的距离。',
        code: '#include <stdio.h>\n\nint main(){\n    double height = 100.0; // 初始高度\n    double distance = 0.0; // 初始距离\n\n    distance = height; // 第一次落地时距离为高度\n    printf("第1次落地时，共经过%5f米，第10次反弹高度为%5f米\\n", distance, height);\n\n    for(int i=2; i<=10; i++){ // 从第二次落地开始计算到第10次\n        height = height / 2; // 高度反弹一半\n        distance = distance + height * 2; // 距离增加反弹高度\n        printf("第%d次落地时，共经过%5f米，第%d次反弹高度为%5f米\\n", i, distance, i, height);\n    }\n    \n    // 计算第10次反弹高度\n    height = height / 2;\n\n    printf("\\n最终结果：第10次落地时，共经过%5f米，第10次反弹高度为%5f米\\n", distance, height);\n\n    return 0;\n}',
        fileName: 'ex20.c'
      }
    ]
  },
  {
    id: 21,
    title: 'ex21',
    description: '',
    solutions: [
      {
        label: '',
        approach: '反向思路，从第10天王前倒推\n    - 前一天的桃子树 = （后一天的桃子树 + 1） * 2;',
        code: '#include <stdio.h>\n\nint main(){\n    int peach = 1; // 最后一天只剩1个\n    int day;\n\n    printf("第10天早上 剩%d个桃子\\n", peach);\n\n    for(day=9; day>=1; day--){\n        peach = (peach + 1) * 2;\n        printf("第%d天早上 剩%d个桃子\\n", day, peach);\n    }\n\n    printf("\\n结论：第一天共摘了%d个桃子。\\n", peach);\n\n    return 0;\n}',
        fileName: 'ex21.c'
      }
    ]
  },
  {
    id: 22,
    title: '两个乒乓球队进行比赛，各出三人，',
    description: '甲队为 a、b、c 三人，乙队为 x、y、z 三人。\n抽签决定比赛名单，有人向队员打听比赛的名单：\na 说他不和 x 比，c 说他不和 x、z 比，\n请编写代码找出三队赛手的名单。',
    solutions: [
      {
        label: '方法一',
        approach: '首先推理一下\n    - 根据限制条件可以得出：a-z, b-x, c-y;\n    - 在程序中用三个循环来判断，根据限制条件来进行判断;\n    - 使用暴力枚举法',
        code: '#include <stdio.h>\n\nint main(){\n    char i, j, k; // a, b, c 的对手\n\n    // 利用三重循环来枚举所有可能的对阵\n    for(i=\'x\'; i<=\'z\'; i++){ // a的对阵\n        for(j=\'x\'; j<=\'z\'; j++){ // b的对阵\n            for(k=\'x\'; k<=\'z\'; k++){ // c的对阵\n                // 限制条件：a不和x比\n                if(i == \'x\') continue;\n                // 限制条件：c不和x、z比\n                if(k == \'x\' || k == \'z\') continue;\n                // 限制条件：三个对手互不相同\n                if(i == j || i == k || j == k) continue;\n\n                printf("最终参赛名单是： ");\n                printf("a--%c\\tb--%c\\tc--%c\\n", i, j, k);\n            }\n        }\n    }\n\n    return 0;\n}',
        fileName: 'ex22.c'
      },
      {
        label: '方法二',
        approach: '首先推理一下\n    - 根据限制条件可以得出：a-z, b-x, c-y;\n    - 在程序中用三个循环来判断，根据限制条件来进行判断;\n    - 使用暴力枚举法，但是放到一个数组中',
        code: '#include <stdio.h>\n\nint main(){\n    char team_a[] = {\'a\', \'b\', \'c\'}; // 甲队: a, b, c\n    char team_b[] = {\'x\', \'y\', \'z\'}; // 乙队: x, y, z\n\n    for(int i=0; i<3; i++){ // a的对手索引\n        for(int j=0; j<3; j++){ // b的对手索引\n            for(int k=0; k<3; k++){ // c的对手索引\n                // 检查三个对手互不相同\n                if(i == j || i == k || j == k) continue;\n                // 检查限制条件\n                if(team_b[i] == \'x\') continue; // a不和x比\n                if(team_b[k] == \'x\' || team_b[k] == \'z\') continue; // c不和x,z比\n\n                printf("最终参赛名单是： ");\n                printf("%c--%c\\t%c--%c\\t%c--%c\\n",\n                        team_a[0], team_b[i],\n                        team_a[1], team_b[j],\n                        team_a[2], team_b[k]);\n            }\n        }\n    }\n\n    return 0;\n}',
        fileName: 'ex22_2.c'
      }
    ]
  },
  {
    id: 23,
    title: '打印出如下图案（菱形）',
    description: '*\n  ***\n *****\n*******\n *****\n  ***\n   *',
    solutions: [
      {
        label: '',
        approach: '总结一下规律：\n    - 分成上下两部分分别用for循环实现\n    - 前四行\n    - 后三行',
        code: '#include <stdio.h>\n\nint main(){\n    for(int i=1; i<=4; i++){\n        // 打印空格\n        for(int j=1; j<=4-i; j++){\n            printf(" ");\n        }\n        // 打印星号\n        for(int k=1; k<=2*i-1; k++){\n            printf("*");\n        }\n        printf("\\n");\n    }\n\n    // 后三行\n    for(int i=1; i<=3; i++){\n        // 打印空格\n        for(int j=1; j<=i; j++){\n            printf(" ");\n        }\n        // 打印星号\n        for(int k=1; k<=7-2*i; k++){\n            printf("*");\n        }\n        printf("\\n");\n    }\n\n    return 0;\n}',
        fileName: 'ex23.c'
      }
    ]
  },
  {
    id: 24,
    title: '有一分数序列：',
    description: '2/1，3/2，5/3，8/5，13/8，21/13...\n求出这个数列的前20项之和。',
    solutions: [
      {
        label: '',
        approach: '观察规律：\n    - 分子：2,3,5,8,13,21,... // 斐波那契数列，从第三项开始，每一项等于前两项之和\n    - 分母：1,2,3,5,8,13,... // 斐波那契数列，从第三项开始，每一项等于前一项之和\n    - 分母序列是分子序列的前一项\n    - 设分子为an,分母为bn\n    - a1=2, b1=1;\n    - a2=3, b2=2;\n    - n>=3: an=a(n-1)+a(n-2), bn=a(n-1).\n    - 使用循环来计算',
        code: '#include <stdio.h>\n\nint main(){\n    float sum = 0.0;\n    float a = 2.0;\n    float b = 1.0;\n\n    for(int i=1; i<=20; i++){\n        sum = sum + (a / b);\n        printf("前%d项之和是：%9.6f\\n", i, sum);\n\n        int temp = a;\n        a = a + b;\n        b = temp;\n    }\n\n    printf("\\n最终结果：这个数列的前20项之和是：%9.6f\\n", sum);\n\n    return 0;\n}',
        fileName: 'ex24.c'
      }
    ]
  },
  {
    id: 25,
    title: '求 1 + 2! + 3! + ... + 20! 的和',
    description: '',
    solutions: [
      {
        label: '',
        approach: '用循环实现，依次计算每一项的阶乘并累加到总和中。\n    - n! = (n-1)! * n',
        code: '#include <stdio.h>\n\nint main(){\n    long long sum = 0;\n    long long factorial = 1; // 用于存储每一项的阶乘\n\n    for(int n=1; n<=20; n++){\n        factorial = factorial * n; // 计算 n! = (n-1)! * n\n        sum = sum + factorial;\n    }\n\n    printf("1 + 2! + 3! + ... + 20! 的和是: %lld\\n", sum);\n\n    return 0;\n}',
        fileName: 'ex25.c'
      }
    ]
  },
  {
    id: 26,
    title: '利用递归方法求 5!',
    description: '',
    solutions: [
      {
        label: '',
        approach: 'n! = n × (n-1)!，其中 0! = 1\n    - 用递归实现',
        code: '#include <stdio.h>\n\n// 递归计算阶乘\nint factorial(int n){\n    if(n == 0 || n == 1){\n        return 1;\n    }else{\n        return n * factorial(n - 1);\n    }\n}\n\nint main(){\n    int n;\n    long long result;\n\n    for(n=0; n<=5; n++){\n        result = factorial(n);\n        printf("%d! = %lld\\n", n, result);\n    }\n\n    return 0;\n}',
        fileName: 'ex26.c'
      }
    ]
  },
  {
    id: 27,
    title: '利用递归函数调用方式，将所输入的5个字符，以相反顺序打印出来',
    description: '',
    solutions: [
      {
        label: '',
        approach: '读取一个字符;\n如果还没读完5个字符，递归调用自己读取下一个字符;\n递归返回后，打印当前字符',
        code: '#include <stdio.h>\n\nvoid print_reverse(int n){\n    char ch;\n\n    if(n > 0){\n        // 读取字符\n        scanf(" %c", &ch);\n        // 递归调用\n        print_reverse(n-1);\n        // 打印字符\n        printf("%c", ch);\n    }\n}\n\nint main(){\n    printf("请输入5个字符：\\n");\n\n    print_reverse(5);\n\n    printf("\\n");\n\n    return 0;\n}',
        fileName: 'ex27.c'
      }
    ]
  },
  {
    id: 28,
    title: '有5个人坐在一起，问第五个人多少岁？',
    description: '他说比第4个人大2岁。\n问第4个人岁数，他说比第3个人大2岁。\n问第三个人，又说比第2人大两岁。\n问第2个人，说比第一个人大两岁。\n最后问第一个人，他说是10岁。\n请问第五个人多大？',
    solutions: [
      {
        label: '',
        approach: 'age(1)=10, \nage(2)=age(1)+2=12, \nage(3)=age(2)+2=14, \nage(4)=age(3)+2=16, \nage(5)=age(4)+2=18.\n用递归实现',
        code: '#include <stdio.h>\n\nint age(int n){\n    if(n == 1){\n        return 10;\n    }else{\n        return age(n - 1) + 2;\n    }\n}\n\nint main(){\n    printf("第五个人的年龄是：%d\\n", age(5));\n\n    return 0;\n}',
        fileName: 'ex28.c'
      }
    ]
  },
  {
    id: 29,
    title: '给一个不多于5位的正整数，',
    description: '要求：一、求它是几位数，二、逆序打印出各位数字。',
    solutions: [
      {
        label: '方法一',
        approach: '- 先判断这个数是几位数 -> 通过不断除以10来判断;\n    - 分解数字 -> 通过算余数来获取每一位数字;\n    - 逆序打印 -> 从个位开始提取并打印',
        code: '#include <stdio.h>\n\nint main(){\n    int num;\n    int count = 0; // 记录位数\n\n    printf("请输入一个不多于5位的正整数：");\n    scanf("%d", &num);\n\n    // 判断位数正确\n    if(num <= 0){\n        printf("错误！请输入一个不多于5位的正整数！\\n");\n        return 1;\n    }\n    if(num > 99999){\n        printf("错误！请输入一个不多于5位的正整数！\\n");\n        return 1;\n    }\n\n    int original = num; // 保存原数值\n    int digit[5]; // 存储每一位数字\n\n    printf("这个数字的逆序为：");\n\n    // 计算位数\n    while(num > 0){\n        int digit = num % 10; // 个位数\n        printf("%d ", digit); // 逆序打印\n        num = num / 10; // 去掉个位数\n        count++; // 位数加1\n    }\n\n    printf("\\n这个数是一个%d位数。\\n", count);\n\n    return 0;\n}',
        fileName: 'ex29.c'
      },
      {
        label: '方法二',
        approach: '依次分解每一位数，然后通过最高位是否为零来判断位数',
        code: '#include <stdio.h>\n\nint main(){\n    int num;\n    int a, b, c, d, e; // 各位数字\n\n    printf("请输入一个不多于5位的正整数：");\n    scanf("%d", &num);\n\n    // 判断位数正确\n    if(num <= 0){\n        printf("错误！请输入一个不多于5位的正整数！\\n");\n        return 1;\n    }\n    if(num > 99999){\n        printf("错误！请输入一个不多于5位的正整数！\\n");\n        return 1;\n    }\n\n    a = num / 10000; // 万位\n    b = (num % 10000) / 1000; // 千位\n    c = (num % 1000) / 100; // 百位\n    d = (num % 100) / 10; // 十位\n    e = num % 10; // 个位\n\n    // 位数判断和输出\n    if (a != 0) {\n        printf("这个数是一个5位数。\\n");\n        printf("这个数的逆序是：%d%d%d%d%d\\n", e, d, c, b, a);\n    } else if(b != 0){\n        printf("这个数是一个4位数。\\n");\n        printf("这个数的逆序是：%d%d%d%d\\n", e, d, c, b);\n    } else if(c != 0){\n        printf("这个数是一个3位数。\\n");\n        printf("这个数的逆序是：%d%d%d\\n", e, d, c);\n    } else if(d != 0){\n        printf("这个数是一个2位数。\\n");\n        printf("这个数的逆序是：%d%d\\n", e, d);\n    } else if(e != 0){\n        printf("这个数是一个1位数。\\n");\n        printf("这个数的逆序是：%d\\n", e);\n    }\n\n    return 0;\n}',
        fileName: 'ex29_2.c'
      }
    ]
  },
  {
    id: 30,
    title: '一个5位数，判断它是不是回文数',
    description: '即12321是回文数，个位与万位相同，十位与千位相同。',
    solutions: [
      {
        label: '',
        approach: '先分解每一位数，5位数：万千百十个，回文数：万=个，千=十',
        code: '#include <stdio.h>\n\nint main(){\n    int num;\n    int a, b, c, d, e; // 各位数字\n\n    printf("请输入一个不多于5位的正整数：");\n    scanf("%d", &num);\n\n    a = num / 10000; // 万位\n    b = (num % 10000) / 1000; // 千位\n    c = (num % 1000) / 100; // 百位\n    d = (num % 100) / 10; // 十位\n    e = num % 10; // 个位\n\n    if(a == e && b == d){\n        printf("%d 是一个回文数。\\n", num);\n    }else{\n        printf("%d 不是一个回文数。\\n", num);\n    }\n\n    return 0;\n}',
        fileName: 'ex30.c'
      }
    ]
  },
  {
    id: 31,
    title: '请输入星期几的第一个字母来判断一下是星期几，如果第一个字母一样，则继续判断第二个字母',
    description: '',
    solutions: [
      {
        label: '',
        approach: 'Monday（星期一）\nTuesday（星期二）\nWednesday（星期三）\nThursday（星期四）\nFriday（星期五）\nSaturday（星期六）\nSunday（星期日）\n- 首字母分析\n    - M：Monday\n    - T：Tuesday（第二个字母u） 或 Thursday（第二个字母h）\n    - W：Wednesday\n    - F：Friday\n    - S：Saturday（第二个字母a） 或 Sunday（第二个字母u）',
        code: '#include <stdio.h>\n\nint main(){\n    char first, second;\n\n    printf("请输入星期几的第一个字母：");\n    scanf(" %c", &first);\n    // 第一个字母转换成大写\n    if(first >= \'a\' && first <= \'z\'){\n        first = first - \'a\' + \'A\';\n    }\n\n    // 根据第一个字母判断\n    switch(first){\n        case \'M\':\n            printf("星期一 Monday\\n");\n            break;\n\n        case \'T\':\n            printf("请输入第二个字母：");\n            scanf(" %c", &second);\n            // 第二个字母转换成小写\n            if(second >= \'A\' && second <= \'Z\'){\n                second = second - \'A\' + \'a\';\n            }\n\n            // 根据第二个字母判断\n            if(second == \'u\'){\n                printf("星期二 Tuesday\\n");\n            } else if(second == \'h\'){\n                printf("星期四 Thursday\\n");\n            } else {\n                printf("错误：无效的第二个字母！\\n");\n            }\n            break;\n\n        case \'W\':\n            printf("星期三 Wednesday\\n");\n            break;\n\n        case \'F\':\n            printf("星期五 Friday\\n");\n            break;\n\n        case \'S\':\n            printf("请输入第二个字母：");\n            scanf(" %c", &second);\n            // 第二个字母转换成小写\n            if(second >= \'A\' && second <= \'Z\'){\n                second = second - \'A\' + \'a\';\n            }\n\n            // 根据第二个字母判断\n            if(second == \'a\'){\n                printf("星期六 Saturday\\n");\n            } else if(second == \'u\'){\n                printf("星期日 Sunday\\n");\n            } else {\n                printf("错误：无效的第二个字母！\\n");\n            }\n            break;\n\n        default:\n            printf("错误：无效的第一个字母！\\n");\n            break;    \n    }\n\n    return 0;\n}',
        fileName: 'ex31.c'
      }
    ]
  },
  {
    id: 32,
    title: '删除一个字符串中的指定字母，如：字符串 "aca"，删除其中的 a 字母',
    description: '',
    solutions: [
      {
        label: '方法一',
        approach: '- 依次遍历字符串中的每个字符;\n- 检查字符是否等于要删除的字符;\n- 如果是，则跳过该字符，否则将该字符添加到新的字符串中;\n- 最后返回新的字符串。',
        code: '#include <stdio.h>\n#include <string.h>\n\nint main(){\n    char string[100]; // 输入的原始字符串\n    char result[100]; // 输出的新字符串\n    char target; // 要删除的字符\n    int i, j = 0;\n\n    printf("请输入一个字符串：");\n    fgets(string, sizeof(string), stdin); // 读取字符串\n\n    printf("请输入要删除的字符：");\n    scanf(" %c", &target); // 读取要删除的字符\n\n    for(i=0; string[i]!=\'\\0\'; i++){\n        if(string[i] != target){\n            result[j] = string[i]; // 将不等于目标字符的字符添加到结果字符串中\n            j++;\n        }\n    }\n    result[j] = \'\\0\'; // 字符串结束符\n\n    printf("删除 \'%c\' 后的字符串是：%s\\n", target, result);\n\n    return 0;\n}',
        fileName: 'ex32.c'
      },
      {
        label: '方法二',
        approach: '- 单独封装成一个函数(数组索引);\n- 依次遍历字符串中的每个字符;\n- 检查字符是否等于要删除的字符;\n- 如果是，则跳过该字符，否则将该字符添加到新的字符串中;\n- 最后返回新的字符串。',
        code: '#include <stdio.h>\n#include <string.h>\n\n// 删除字符串中的指定字符，返回新字符串\nvoid delete_char(char *src, char *dest, char target){\n    int i, j = 0;\n    \n    for(i=0; src[i]!=\'\\0\'; i++){\n        if(src[i] != target){\n            dest[j] = src[i];\n            j++;\n        }\n    }\n\n    dest[j] = \'\\0\'; // 添加字符串结束符\n}\n\nint main(){\n    char string[100];\n    char result[100];\n    char target;\n\n    printf("请输入一个字符串：");\n    fgets(string, sizeof(string), stdin); // 读取字符串\n    string[strcspn(string, "\\n")] = \'\\0\'; // 去掉换行符\n\n    printf("请输入要删除的字符：");\n    scanf(" %c", &target); // 读取要删除的字符\n\n    // 调用函数\n    delete_char(string, result, target);\n\n    printf("删除\'%c\'后的字符串：%s\\n", target, result);\n\n    return 0;\n}',
        fileName: 'ex32_2.c'
      }
    ]
  },
  {
    id: 33,
    title: '判断一个数字是否为质数',
    description: '',
    solutions: [
      {
        label: '',
        approach: '质数判断：一个大于1的自然数，除了1和它本身以外，不能被其他自然数整除。',
        code: '#include <stdio.h>\n#include <math.h>\n\nint main(){\n    int num;\n    int isPrime = 1; // isPrime标志，1表示是质数，0表示不是质数\n\n    printf("请输入一个大于1的正整数：");\n    scanf("%d", &num);\n\n    // 验证输入是否有效\n    if(num <=1){\n        printf("错误：输入的数字必须大于1");\n        return 0;\n    }\n\n    // 2是质数\n    if(num == 2){\n        printf("%d 是质数。\\n", num);\n        return 0;\n    }\n\n    // 除2以外的偶数都不是质数\n    if(num % 2 ==0){\n        printf("%d 不是质数。\\n", num);\n        return 0;\n    }\n\n    // 只需要检查到sqrt(num)即可\n    // 只需要检查奇数，偶数已经检查过了\n    for(int i=3; i<=sqrt(num); i=i+2){\n        if(num % i == 0){\n            isPrime = 0;\n            break;\n        }\n    }\n\n    if(isPrime){\n        printf("%d 是质数。\\n", num);\n    } else {\n        printf("%d 不是质数。\\n", num);\n    }\n\n    return 0;\n}',
        fileName: 'ex33.c'
      }
    ]
  },
  {
    id: 34,
    title: '练习函数调用',
    description: '',
    solutions: [
      {
        label: '',
        approach: '',
        code: '#include <stdio.h>\n\n// 函数声明\nvoid hello_world(void){\n    printf("Hello, world!\\n");\n}\n\nvoid three_hellos(void){\n    for(int i=1; i<=3; i++){\n        hello_world(); // 调用 hello_world 函数\n    }\n}\n\nint main(void){\n    three_hellos(); // 调用 three_hellos 函数\n\n    return 0;\n}',
        fileName: 'ex34.c'
      }
    ]
  },
  {
    id: 35,
    title: '字符串反转，如将字符串 "www.runoob.com" 反转为 "moc.boonur.www"',
    description: '',
    solutions: [
      {
        label: '',
        approach: '使用数组下标实现',
        code: '#include <stdio.h>\n#include <string.h>\n\nvoid reverse_string(char str[]){\n    int length = strlen(str);\n    int start = 0;\n    int end = length - 1;\n\n    while(start < end){\n        // 交换字符\n        char temp = str[start];\n        str[start] = str[end];\n        str[end] = temp;\n\n        start++;\n        end--;\n    }\n}\n\nint main(){\n    char str[] = "www.runoob.com";\n\n    printf("原字符串: %s\\n", str);\n    reverse_string(str);\n    printf("反转后的字符串: %s\\n", str);\n\n    return 0;\n}',
        fileName: 'ex35.c'
      }
    ]
  },
  {
    id: 36,
    title: '求100之内的素数',
    description: '',
    solutions: [
      {
        label: '',
        approach: '质数（prime number）又称素数，有无限个。\n一个大于1的自然数，除了1和它本身外，不能被其他自然数整除。',
        code: '#include <stdio.h>\n#include <math.h>\n\nint main(){\n    int num;\n    int count = 0;\n\n    printf("100之内的素数有：\\n");\n\n    for(num=2; num<=100; num++){\n        int isPrime = 1;\n\n        for(int i=2; i<=sqrt(num); i++){\n            if(num % i == 0){\n                isPrime = 0;\n                break;\n            }\n        }\n\n        if(isPrime){\n            printf("%d ", num);\n            count++;\n            if(count % 5 == 0){\n                printf("\\n");\n            }\n        }\n    }\n\n    return 0;\n}',
        fileName: 'ex36.c'
      }
    ]
  },
  {
    id: 37,
    title: '对10个数进行排序',
    description: '',
    solutions: [
      {
        label: '',
        approach: '利用选择法，即从后9个比较过程中，选择一个最小的与第一个元素交换， \n下次类推，即用第二个元素与后8个进行比较，并进行交换。',
        code: '#include <stdio.h>\n\n#define SIZE 10\n\nvoid selection_sort(int arr[], int n){\n    for(int i=0; i<n-1; i++){\n        // 找最小元素的位置\n        int min_index = i;\n        for(int j=i+1; j<n; j++){\n            if(arr[j] < arr[min_index]){\n                min_index = j;\n            }\n        }\n\n        // 交换最小元素与当前元素\n        if(min_index != i){\n            int temp = arr[i];\n            arr[i] = arr[min_index];\n            arr[min_index] = temp;\n        }\n    }\n}\n\nint main(){\n    int arr[SIZE];\n    \n    printf("请输入%d个整数：\\n", SIZE);\n    \n    for(int i=0; i<SIZE; i++){\n        scanf("%d", &arr[i]);\n    }\n\n    selection_sort(arr, SIZE);\n\n    printf("排序后的结果是：\\n");\n    for(int i=0; i<SIZE; i++){\n        printf("%d ", arr[i]);\n    }\n    printf("\\n");\n\n    return 0;\n}',
        fileName: 'ex37.c'
      }
    ]
  },
  {
    id: 38,
    title: '求一个3*3矩阵对角线元素之和',
    description: '',
    solutions: [
      {
        label: '',
        approach: '利用双重for循环控制输入二维数组，再将a[i][i]累加后输出。',
        code: '#include <stdio.h>\n\n#define SIZE 3\n\nint main(){\n    int matrix[SIZE][SIZE];\n    int sum = 0;\n\n    // 输入矩阵\n    printf("请输入一个%d*%d的矩阵：\\n", SIZE, SIZE);\n    for(int i=0; i<SIZE; i++){\n        for(int j=0; j<SIZE; j++){\n            scanf("%d", &matrix[i][j]);\n        }\n    }\n\n    // 打印矩阵\n    printf("\\n输入的矩阵是：\\n");\n    for(int i=0; i<SIZE; i++){\n        for(int j=0; j<SIZE; j++){\n            printf("%4d", matrix[i][j]);\n        }\n        printf("\\n");\n    }\n\n    // 计算主对角线元素之和\n    for(int i=0; i<SIZE; i++){\n        sum = sum + matrix[i][i];\n    }\n\n    printf("\\n矩阵的主对角线元素之和为：%d\\n", sum);\n\n    return 0;\n}',
        fileName: 'ex38.c'
      }
    ]
  },
  {
    id: 39,
    title: '有一个已经排好序的数组',
    description: '现输入一个数，要求按原来的规律将它插入数组中。',
    solutions: [
      {
        label: '',
        approach: '- 从前往后遍历，找到第一个满足插入条件的位置;\n- 从数组末尾开始，将插入位置后的元素都向后移动一位;\n- 在新位置插入元素;\n- 更新数组大小',
        code: '#include <stdio.h>\n\n#define MAX_SIZE 100\n\nint main(){\n    int arr[MAX_SIZE];\n    int n; // 当前数组元素个数\n    int new_num; // 要插入的数\n\n    // 输入已排序的数组\n    printf("请输入已排序的数组元素个数（不超过%d）：", MAX_SIZE - 1);\n    scanf("%d", &n);\n\n    // 判断数组范围有效\n    if(n <= 0 || n >= MAX_SIZE){\n        printf("输入的数组大小不合法！\\n");\n        return 1;\n    }\n\n    // 输入数组元素\n    printf("请输入%d个已排序的整数（从小到大）：\\n", n);\n    for(int i=0; i<n; i++){\n        scanf("%d", &arr[i]);\n    }\n\n    // 判断数组是否已排序\n    for(int i=1; i<n; i++){\n        if(arr[i] < arr[i-1]){\n            printf("输入的数组未按升序排序！\\n");\n            return 1;\n        }\n    }\n\n    // 输入要插入的数\n    printf("请输入要插入的整数：");\n    scanf("%d", &new_num);\n\n    // 原始数组\n    printf("插入前的原始数组：\\n");\n    for(int i=0; i<n; i++){\n        printf("%d ", arr[i]);\n    }\n    printf("\\n");\n\n    // 找到插入位置\n    int pos = n; // 默认插入到数组末尾\n    for(int i=0; i<n; i++){\n        if(new_num < arr[i]){\n            pos = i;\n            break;\n        }\n    }\n\n    // 后移元素\n    for(int i=n; i>pos; i--){\n        arr[i] = arr[i-1];\n    }\n\n    // 插入新元素\n    arr[pos] = new_num;\n    n++; // 更新数组大小\n\n    printf("\\n插入后的数组：\\n");\n    for(int i=0; i<n; i++){\n        printf("%d ", arr[i]);\n    }\n    printf("\\n");\n\n    printf("插入位置：第%d个元素\\n", pos+1);\n\n    return 0;\n}',
        fileName: 'ex39.c'
      }
    ]
  },
  {
    id: 40,
    title: '将一个数组逆序输出',
    description: '',
    solutions: [
      {
        label: '',
        approach: '使用一个临时数组交换第一个数和最后一个数',
        code: '#include <stdio.h>\n\n#define MAX_SIZE 100\n\nint main(){\n    int arr[MAX_SIZE];\n    int n; // 数组元素个数\n\n    // 输入数组元素个数\n    printf("请输入数组元素个数（不超过%d）：", MAX_SIZE-1);\n    scanf("%d", &n);\n\n    // 判断数组范围有效\n    if(n <= 0 || n >= MAX_SIZE){\n        printf("输入的数组大小不合法！\\n");\n        return 1;\n    }\n\n    printf("请输入%d个整数：\\n", n);\n    for(int i=0; i<n; i++){\n        scanf("%d", &arr[i]);\n    }\n\n    // 原始数组\n    printf("\\n原始数组：\\n");\n    for(int i=0; i<n; i++){\n        printf("%d ", arr[i]);\n    }\n    printf("\\n");\n\n    // 用临时数组对数组逆序\n    int temp[MAX_SIZE];\n    for(int i=0; i<n; i++){\n        temp[i] = arr[n-1-i];\n    }\n\n    // 输出逆序数组\n    printf("\\n逆序输出的数组：\\n");\n    for(int i=0; i<n; i++){\n        printf("%d ", temp[i]);\n    }\n    printf("\\n");\n\n    return 0;\n}',
        fileName: 'ex40.c'
      }
    ]
  },
  {
    id: 41,
    title: '学习 static 定义静态变量的用法',
    description: '在 C 语言中，static 关键字用于声明静态变量。\n静态变量与普通变量不同，它们的生存期和作用域是不同的。\n静态变量在声明时被初始化，只被初始化一次，而且在整个程序的生命周期内都保持存在。\n在函数内声明的静态变量只能在该函数内访问，而在函数外声明的静态变量则只能在该文件内访问。',
    solutions: [
      {
        label: '',
        approach: '以下实例中 foo() 函数声明了一个静态变量 x，并将其初始化为 0。\n每次调用 foo() 函数时，x 的值都会加 1，并打印出新的值。\n由于 x 是静态变量，它在程序的整个生命周期中都存在，而不仅仅是在函数调用时存在。\n因此，每次调用 foo() 时，它都可以记住 x 的值，并在此基础上递增。',
        code: '#include <stdio.h>\n\nvoid foo(){\n    static int x = 0;\n    x++;\n    printf("x = %d\\n", x);\n}\n\nint main(){\n    foo(); // 输出 x = 1\n    foo(); // 输出 x = 2\n    foo(); // 输出 x = 3\n\n    return 0;\n}',
        fileName: 'ex41.c'
      }
    ]
  },
  {
    id: 42,
    title: '学习使用auto定义变量的用法',
    description: '',
    solutions: [
      {
        label: '',
        approach: '',
        code: '#include <stdio.h>\n\nint main(){\n    int i;\n    int num = 2;\n\n    for(i=0; i<3; i++){\n        printf("num 变量的值是：%d\\n", num);\n        num++;\n        {\n            auto int num=1;\n            printf("内置模块 num 变量的值是：%d\\n", num);\n            num++;\n        }\n    }\n\n    return 0;\n}',
        fileName: 'ex42.c'
      }
    ]
  },
  {
    id: 43,
    title: '学习使用static的另一用法',
    description: '',
    solutions: [
      {
        label: '',
        approach: '',
        code: '#include <stdio.h>\n\nint main(){\n    int i;\n    int num = 2;\n\n    for(i=0; i<3; i++){\n        printf("num 变量的值是：%d\\n", num);\n        num++;\n        {\n            static int num=1;\n            printf("内置模块 num 变量的值是：%d\\n", num);\n            num++;\n        }\n    }\n\n    return 0;\n}',
        fileName: 'ex43.c'
      }
    ]
  },
  {
    id: 44,
    title: '学习使用如何调用外部函数',
    description: '',
    solutions: [
      {
        label: '',
        approach: '',
        code: '#include <stdio.h>\n\nint a, b, c;\n\nvoid add(){\n    int a;\n    a = 3;\n    c = a + b;\n}\n\nint main(){\n    a = b = 4;\n    add();\n    printf("c 的值是：%d\\n", c);\n\n    return 0;\n}',
        fileName: 'ex44.c'
      }
    ]
  },
  {
    id: 45,
    title: '学习使用register定义变量的方法',
    description: '',
    solutions: [
      {
        label: '',
        approach: '',
        code: '#include <stdio.h>\n\nint main(){\n    register int i;\n    int tmp = 0;\n\n    for(i=1; i<=100; i++){\n        tmp += i;\n    }\n\n    printf("总和为：%d\\n", tmp);\n\n    return 0;\n}',
        fileName: 'ex45.c'
      }
    ]
  },
  {
    id: 46,
    title: '宏#define命令练习',
    description: '',
    solutions: [
      {
        label: '',
        approach: '',
        code: '#include <stdio.h>\n#define TRUE 1\n#define FALSE 0\n#define SQ(x) ((x)*(x))\n\nint main(){\n    int num;\n    int again = 1;\n\n    printf("如果值小于 50 程序将终止。\\n");\n\n    while(again){\n        printf("\\n请输入一个数字：");\n        scanf("%d", &num);\n\n        printf("该数字的平方是：%d\\n", SQ(num));\n\n        if(num >= 50){\n            again = TRUE;\n        }else{\n            again = FALSE;\n        }\n    }\n\n    return 0;\n}',
        fileName: 'ex46.c'
      }
    ]
  },
  {
    id: 47,
    title: '宏#define命令练习2',
    description: '',
    solutions: [
      {
        label: '',
        approach: '',
        code: '#include <stdio.h>\n#define exchange(a,b) {int t; t=a; a=b; b=t;} // 注意放在一行\n\nint main(){\n    int x = 10;\n    int y = 20;\n\n    printf("x = %d; y = %d\\n", x, y);\n    exchange(x, y);\n    printf("x = %d; y = %d\\n", x, y);\n\n    return 0;\n}',
        fileName: 'ex47.c'
      }
    ]
  },
  {
    id: 48,
    title: '宏#define命令练习3',
    description: '',
    solutions: [
      {
        label: '',
        approach: '',
        code: '#include <stdio.h>\n#define LAG >\n#define SMA <\n#define EQ ==\n\nint main(){\n    int i, j;\n\n    printf("请输入两个整数：\\n");\n    scanf("%d %d", &i, &j);\n\n    if(i LAG j){\n        printf("%d 大于 %d\\n", i, j);\n    } else if(i EQ j){\n        printf("%d 等于 %d\\n", i, j);\n    } else if(i SMA j){\n        printf("%d 小于 %d\\n", i, j);\n    } else{\n        printf("没有值。\\n");\n    }\n\n    return 0;\n}',
        fileName: 'ex48.c'
      }
    ]
  },
  {
    id: 49,
    title: '#if #ifdef和#ifndef的综合应用',
    description: '',
    solutions: [
      {
        label: '',
        approach: '',
        code: '#include <stdio.h>\n#define MAX\n#define MAXIMUM(x,y) (x>y)?x:y\n#define MINIMUM(x,y) (x>y)?y:x\n\nint main(){\n    int a = 10;\n    int b = 20;\n\n    #ifdef MAX\n        printf("更大的数字是 %d\\n", MAXIMUM(a,b));\n    #else\n        printf("更小的数字是 %d\\n", MINIMUM(a,b));\n    #endif\n    #ifndef MIN\n        printf("更小的数字是 %d\\n", MINIMUM(a,b));\n    #else\n        printf("更大的数字是 %d\\n", MAXIMUM(a,b));\n    #endif\n    #undef MAX\n    #ifdef MAX\n        printf("更大的数字是 %d\\n", MAXIMUM(a,b));\n    #else\n        printf("更小的数字是 %d\\n", MINIMUM(a,b));\n    #endif\n    #define MIN\n    #ifndef MIN\n        printf("更小的数字是 %d\\n", MINIMUM(a,b));\n    #else\n        printf("更大的数字是 %d\\n", MAXIMUM(a,b));\n    #endif\n\n    return 0;\n}',
        fileName: 'ex49.c'
      }
    ]
  },
  {
    id: 51,
    title: '学习使用按位与 &',
    description: '',
    solutions: [
      {
        label: '',
        approach: '0&0=0; 0&1=0; 1&0=0; 1&1=1 。',
        code: '#include <stdio.h>\n\nint main(){\n    int a = 077;\n    int b = a & 3;\n\n    printf("a & b(decimal) = %d\\n", b);\n\n    b &= 7;\n    printf("a & b(decimal) = %d\\n", b);\n\n    return 0;\n}',
        fileName: 'ex51.c'
      }
    ]
  },
  {
    id: 52,
    title: '学习使用按位或 |',
    description: '',
    solutions: [
      {
        label: '',
        approach: '0|0=0; 0|1=1; 1|0=1; 1|1=1 。',
        code: '#include <stdio.h>\n\nint main(){\n    int a = 077;\n    int b = a | 3;\n    printf("a | b(decimal) = %d\\n", b);\n\n    b |= 7;\n    printf("a | b(decimal) = %d\\n", b);\n\n    return 0;\n}',
        fileName: 'ex52.c'
      }
    ]
  },
  {
    id: 53,
    title: '学习使用按位异或 ^',
    description: '',
    solutions: [
      {
        label: '',
        approach: '0^0=0; 0^1=1; 1^0=1; 1^1=0 。',
        code: '#include <stdio.h>\n\nint main(){\n    int a = 077;\n    int b = a ^ 3;\n    printf("b 的值为：%d\\n", b);\n    \n    b ^= 7;\n    printf("b 的值为：%d\\n", b);\n\n    return 0;\n}',
        fileName: 'ex53.c'
      }
    ]
  },
  {
    id: 54,
    title: '取一个整数 a 从右端开始的 4～7 位',
    description: '',
    solutions: [
      {
        label: '方法一',
        approach: '- 先把a向右移4位;\n- 设置一个低四位全为1;\n- 将上面两个进行&运算。',
        code: '#include <stdio.h>\n\nint main(){\n    unsigned int a;\n\n    printf("请输入一个整数：");\n    scanf("%o", &a); // 输入为八进制\n\n    printf("\\n=== 取 a 从右端开始的 4～7 位 ===\\n");\n    \n    // 先把a向右移4位\n    unsigned int right_shift_4 = a >> 4;\n\n    // 设置一个低四位全为1, 其余全为0的数\n    // ~0: 所有位全为1\n    // ~0 << 4: 低四位全为0, 其余全为1\n    // ~(~0 << 4): 低四位全为1, 其余全为0\n    unsigned int mask = ~(~0 << 4);\n\n    // 将上面两个进行&运算\n    unsigned int result = right_shift_4 & mask;\n\n    printf("a 从右端开始的 4～7 位的值为：%o\\n", result);\n\n    return 0;\n}',
        fileName: 'ex54.c'
      },
      {
        label: '方法二',
        approach: '- 先把a向右移4位;\n- 设置一个低四位全为1;\n- 将上面两个进行&运算。',
        code: '#include <stdio.h>\n\nint main(){\n    unsigned int a;\n\n    printf("请输入一个整数：");\n    scanf("%u", &a); // 输入为十进制\n\n    printf("\\n=== 取 a 从右端开始的 4～7 位 ===\\n");\n    \n    // 先把a向右移4位\n    unsigned int right_shift_4 = a >> 4;\n\n    // 设置一个低四位全为1, 其余全为0的数\n    // ~0: 所有位全为1\n    // ~0 << 4: 低四位全为0, 其余全为1\n    // ~(~0 << 4): 低四位全为1, 其余全为0\n    unsigned int mask = ~(~0 << 4);\n\n    // 将上面两个进行&运算\n    unsigned int result = right_shift_4 & mask;\n\n    printf("a 从右端开始的 4～7 位的值为：%u\\n", result);\n\n    return 0;\n}',
        fileName: 'ex54_2.c'
      }
    ]
  },
  {
    id: 55,
    title: '学习使用按位取反~',
    description: '',
    solutions: [
      {
        label: '',
        approach: '~0=-1; ~1=-2;',
        code: '#include <stdio.h>\n\nint main(){\n    int a = 234;\n    int b = ~a;\n\n    printf("a 的按位取反值为（十进制）：%d\\n", b);\n\n    a = ~a;\n    printf("a 的按位取反值为（十六进制）：%x\\n", a);\n\n    return 0;\n}',
        fileName: 'ex55.c'
      }
    ]
  },
  {
    id: 61,
    title: '打印出杨辉三角形（要求打印出10行）',
    description: '',
    solutions: [
      {
        label: '',
        approach: '结构如下所示：\n1\n1    1\n1    2    1\n1    3    3    1\n1    4    6    4    1\n\n- 用二维数组实现',
        code: '#include <stdio.h>\n\nint main(){\n    int triangle[10][10];\n\n    printf("=== 杨辉三角（10行） ===\\n");\n\n    // 初始化第一列和对角线都为1\n    for(int i=0; i<10; i++){\n        triangle[i][0] = 1; // 第一列都为1\n        triangle[i][i] = 1; // 对角线都为1\n    }\n\n    // 计算其他元素\n    for(int i=2; i<10; i++){\n        for(int j=1; j<i; j++){\n            triangle[i][j] = triangle[i-1][j-1] + triangle[i-1][j];\n        }\n    }\n\n    // 打印\n    for(int i=0; i<10; i++){\n        // 打印数字\n        for(int j=0; j<=i; j++){\n            printf("%5d", triangle[i][j]);\n        }\n        printf("\\n");\n    }\n\n    return 0;\n}',
        fileName: 'ex61.c'
      }
    ]
  },
  {
    id: 66,
    title: '输入3个数a,b,c，按大小顺序输出',
    description: '',
    solutions: [
      {
        label: '',
        approach: '利用指针方法。',
        code: '#include <stdio.h>\n\n// 使用指针交换两个变量的值\nvoid swap(int *x, int *y){\n    int temp = *x;\n    *x = *y;\n    *y = temp;\n}\n\n// 对三个数进行排序\nvoid sort(int *a, int *b, int *c){\n    if(*a > *b){\n        swap(a, b);\n    }\n    if(*a > *c){\n        swap(a, c);\n    }\n    if(*b > *c){\n        swap(b, c);\n    }\n}\n\nint main(){\n    int a, b, c;\n\n    printf("请输入3个整数（以空格分隔）：");\n    scanf("%d %d %d", &a, &b, &c);\n\n    printf("\\n排序前：a=%d, b=%d, c=%d\\n", a, b, c);\n\n    // 排序\n    sort(&a, &b, &c);\n\n    printf("排序后（从小到大）：a=%d, b=%d, c=%d\\n", a, b, c);\n\n    return 0;\n}',
        fileName: 'ex66.c'
      }
    ]
  },
  {
    id: 67,
    title: '输入数组，最大的与第一个元素交换，最小的与最后一个元素交换，输出数组',
    description: '',
    solutions: [
      {
        label: '',
        approach: '- 先遍历查找最大值和最小值的索引;\n- 交换最大值到第一个;\n- 交换最小值到最后一个;',
        code: '#include <stdio.h>\n\n#define MAX_SIZE 100\n\nvoid swap(int *a, int *b){\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\n\nint main(){\n    int arr[MAX_SIZE];\n    int n;\n\n    printf("请输入数组的大小（不超过 %d）：", MAX_SIZE);\n    scanf("%d", &n);\n\n    if(n <= 0 || n > MAX_SIZE){\n        printf("错误！输入数组大小不合法。\\n");\n        return 1;\n    }\n\n    printf("请输入 %d 个整数（以空格分隔）：", n);\n    for(int i=0; i<n; i++){\n        scanf("%d", &arr[i]);\n    }\n\n    printf("原始数组：");\n    for(int i=0; i<n; i++){\n        printf("%d ", arr[i]);\n    }\n    printf("\\n");\n\n    // 找最大值和最小值的索引\n    int max_index = 0;\n    int min_index = 0;\n\n    for(int i=1; i<n; i++){\n        if(arr[i] > arr[max_index]){\n            max_index = i;\n        }\n        if(arr[i] < arr[min_index]){\n            min_index = i;\n        }\n    }\n\n    // 交换最大值到第一个\n    if(max_index != 0){\n        swap(&arr[0], &arr[max_index]);\n\n        // 如果最小值在第一个位置，交换后它的位置变了\n        if(min_index == 0){\n            min_index = max_index;\n        }\n    }\n\n    // 交换最小值到最后一个\n    if(min_index != n-1){\n        swap(&arr[n-1], &arr[min_index]);\n    }\n\n    printf("调整后的数组：");\n    for(int i=0; i<n; i++){\n        printf("%d ", arr[i]);\n    }\n    printf("\\n");\n\n    return 0;\n}',
        fileName: 'ex67.c'
      }
    ]
  },
  {
    id: 68,
    title: '有 n 个整数，使其前面各数顺序向后移 m 个位置，最后m个数变成最前面的 m 个数',
    description: '',
    solutions: [
      {
        label: '',
        approach: '- 使用临时数组\n    - 创建一个大小为m的临时数组;\n    - 保存最后m个元素到临时数组;\n    - 将前n-m个元素向后移动m个位置;\n    - 将临时数组中的元素复制到数组前m个位置',
        code: '#include <stdio.h>\n#include <stdlib.h>\n\n// 使用辅助数组\nvoid rotate_array(int arr[], int n, int m){\n    if(n<=0 || m<=0 || m>=n){\n        return;\n    }\n\n    // 创建临时数组保存最后m个元素\n    int *temp = (int*)malloc(m * sizeof(int));\n    if(temp == NULL){\n        printf("错误！内存分配失败！\\n");\n        return;\n    }\n\n    // 保存最后m个元素到临时数组\n    for(int i=0; i<m; i++){\n        temp[i] = arr[n - m + i];\n    }\n\n    // 将前n-m个元素向后移动m个位置\n    // 从后往前移动，避免覆盖\n    for(int i=n-1; i>=m; i--){\n        arr[i] = arr[i-m];\n    }\n\n    // 将临时数组中的元素复制到数组前m个位置\n    for(int i=0; i<m; i++){\n        arr[i] = temp[i];\n    }\n\n    free(temp);\n}\n\nint main(){\n    int n, m;\n    printf("请输入整数个数 n : ");\n    scanf("%d", &n);\n\n    printf("请输入向后移动的位置 m : ");\n    scanf("%d", &m);\n\n    int arr[n];\n\n    printf("请输入 %d 个整数 : ", n);\n    for(int i=0; i<n; i++){\n        scanf("%d", &arr[i]);\n    }\n\n    rotate_array(arr, n, m);\n\n    printf("移动后的数组： ");\n    for(int i=0; i<n; i++){\n        printf("%d ", arr[i]);\n    }\n    printf("\\n");\n\n    return 0;\n}',
        fileName: 'ex68.c'
      }
    ]
  },
  {
    id: 69,
    title: '有n个人围成一圈，顺序排号',
    description: '从第一个人开始报数（从1到3报数），凡报到3的人退出圈子，\n问最后留下的是原来第几号的那位。',
    solutions: [
      {
        label: '',
        approach: '约瑟夫环问题\n- 使用数组模拟\n    - 用数组储存每个人的编号;\n    - 第一个人从1开始报数，凡报到3的人退出圈子，将其编号为0;\n    - 使用循环指针i遍历数组，跳过编号为0的人;\n    - 当只剩一人是停止循环',
        code: '#include <stdio.h>\n\nint main(){\n    int persons[50]; // 存储每个人的编号\n    int n; // 总人数\n    int current = 0; // 当前指针位置\n    int count = 0; // 报数值\n    int out_count = 0; // 退出圈子的人数\n    int remaining; // 剩余人数\n\n    // 输入总人数\n    printf("请输入总人数(1-50)：");\n    scanf("%d", &n);\n\n    if(n <= 0 || n > 50){\n        printf("错误！请输入正确的总人数！\\n");\n        return 1;\n    }\n\n    // 初始化数组\n    for(int i=0; i<n; i++){\n        persons[i] = i+1; // 从1开始编号\n    }\n\n    // 显示初始状态\n    printf("总人数：%d\\n", n);\n    printf("初始编号：");\n    for(int i=0; i<n; i++){\n        printf("%d ", persons[i]);\n    }\n    printf("\\n");\n\n    // 模拟报数\n    remaining = n;\n    int round = 1; // 轮次计数\n\n    while(remaining > 1){\n        // 如果当前人尚未退出\n        if(persons[current] != 0){\n            count++; // 计数\n\n            // 如果报数值为3，退出圈子\n            if(count == 3){\n                persons[current] = 0; // 标记为退出圈子\n                count = 0; // 计数归零\n                out_count++; // 退出圈子的人数+1\n                remaining--; // 剩余人数-1\n\n                // 显示退出信息\n                printf("第%d轮: ", round);\n                for(int i=0; i<n; i++){\n                    if(persons[i] != 0){\n                        printf("%d ", persons[i]);\n                    }\n                }\n                printf("\\n");\n\n                round++; // 轮次+1\n            }\n        }\n\n        // 移动到下一个人\n        current++;\n\n        // 如果到头了，回到第一个人\n        if(current >= n){\n            current = 0;\n        }\n    }\n\n    // 显示最后留下的人\n    for(int i=0; i<n; i++){\n        if(persons[i] != 0){\n            printf("最后留下的是：%d号\\n", persons[i]);\n            break;\n        }\n    }\n\n    return 0;\n}',
        fileName: 'ex69.c'
      }
    ]
  },
  {
    id: 70,
    title: '写一个函数，求一个字符串的长度，在 main 函数中输入字符串，并输出其长度',
    description: '',
    solutions: [
      {
        label: '',
        approach: '- 遍历字符串的每个字符;\n- 遇到字符串结束符 \'\\0\' 时停止;\n- 统计遍历的字符数;',
        code: '#include <stdio.h>\n\n// 定义字符串长度函数\nint strlength(const char *str){\n    int length = 0;\n\n    // 遍历字符串，遇到结束符时停止\n    while(str[length] != \'\\0\'){\n        length++;\n    }\n\n    return length;\n}\n\nint main(){\n    char str[100];\n\n    printf("请输入字符串：");\n\n    // 读取字符串，用fgets，包含空格\n    fgets(str, sizeof(str), stdin);\n\n    // 去掉fgets可能读取的换行符\n    int i = 0;\n    while(str[i] != \'\\0\'){\n        if(str[i] == \'\\n\'){\n            str[i] = \'\\0\';\n            break;\n        }\n        i++;\n    }\n\n    // 计算字符串长度\n    int length = strlength(str);\n\n    printf("字符串长度为：%d\\n", length);\n\n    return 0;\n}',
        fileName: 'ex70.c'
      }
    ]
  },
  {
    id: 71,
    title: '编写input()和output()函数输入，输出5个学生的数据记录',
    description: '',
    solutions: [
      {
        label: '',
        approach: '',
        code: '#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct{\n    char name[20];\n    char sex[5];\n    int age;\n}Stu;\n\nvoid input(Stu*stu);\nvoid output(Stu*stu);\n\nint main(){\n    Stu stu[5];\n    printf("请输入5个学生的数据记录：\\n");\n    printf("姓名\\t性别\\t年龄\\n");\n    input(stu);\n    printf("5个学生的数据记录如下：\\n");\n    printf("姓名\\t性别\\t年龄\\n");\n    output(stu);\n\n    system("pause");\n\n    return 0;\n}\n\nvoid input(Stu*stu){\n    int i;\n    for(i=0; i<5; i++){\n        scanf("%s %s %d", stu[i].name, stu[i].sex, &stu[i].age);\n    }\n}\n\nvoid output(Stu*stu){\n    int i;\n    for(i=0; i<5; i++){\n        printf("%s\\t%s\\t%d\\n", stu[i].name, stu[i].sex, stu[i].age);\n    }\n}',
        fileName: 'ex71.c'
      }
    ]
  },
  {
    id: 72,
    title: '创建一个链表',
    description: '',
    solutions: [
      {
        label: '',
        approach: '',
        code: '#include <stdio.h>\n#include <stdlib.h>\n#include <malloc.h>\n\ntypedef struct LNode{\n    int data;\n    struct LNode *next;\n}LNode, *LinkList;\n\nLinkList CreateList(int n);\n\nvoid print(LinkList h);\n\nint main(){\n    LinkList Head = NULL;\n\n    int n;\n\n    scanf("%d", &n);\n    Head = CreateList(n);\n\n    printf("刚刚建立的各个链表元素的值为：\\n");\n    print(Head);\n\n    printf("\\n\\n");\n\n    system("pause");\n\n    return 0;\n}\n\nLinkList CreateList(int n){\n    LinkList L, p, q;\n    int i;\n\n    L = (LNode*)malloc(sizeof(LNode));\n\n    if(!L) return 0;\n\n    L -> next = NULL;\n\n    q = L;\n\n    for(i=1; i<=n; i++){\n        p = (LinkList)malloc(sizeof(LNode));\n        printf("请输入第%d个元素的值：", i);\n        scanf("%d", &(p->data));\n        p -> next = NULL;\n        q -> next = p;\n        q = p;\n    }\n\n    return L;\n}\n\nvoid print(LinkList h){\n    LinkList p = h -> next;\n    while(p != NULL){\n        printf("%d ", p -> data);\n        p = p -> next;\n    }\n}',
        fileName: 'ex72.c'
      }
    ]
  },
  {
    id: 73,
    title: '反向输出一个链表',
    description: '',
    solutions: [
      {
        label: '',
        approach: '',
        code: '#include <stdio.h>\n#include <stdlib.h>\n#include <malloc.h>\n\ntypedef struct LNode{\n    int data;\n    struct LNode *next;\n}LNode, *LinkList;\n\nLinkList CreateList(int n);\n\nvoid print(LinkList h);\n\nint main(){\n    LinkList Head=NULL;\n    int n;\n    \n    scanf("%d",&n);\n    Head=CreateList(n);\n    \n    printf("刚刚建立的各个链表元素的值为：\\n");\n    print(Head);\n    \n    printf("\\n\\n");\n    system("pause");\n    return 0;\n}\n\nLinkList CreateList(int n){\n    LinkList L,p,q;\n    int i;\n\n    L=(LNode*)malloc(sizeof(LNode));\n    \n    if(!L)return 0;\n    \n    L->next=NULL;\n    q=L;\n    \n    for(i=1;i<=n;i++){\n        p=(LinkList)malloc(sizeof(LNode));\n        printf("请输入第%d个元素的值:",i);\n        scanf("%d",&(p->data));\n        p->next=NULL;\n        q->next=p;\n        q=p;\n    }\n\n    return L;\n}\n\nvoid print(LinkList h){\n    LinkList p=h->next;\n    \n    while(p!=NULL){\n        printf("%d ",p->data);\n        p=p->next;\n    }\n}',
        fileName: 'ex73.c'
      }
    ]
  },
  {
    id: 74,
    title: '连接两个链表',
    description: '',
    solutions: [
      {
        label: '',
        approach: '',
        code: '#include <stdio.h>\n#include <stdlib.h>\n\nstruct list{\n    int data;\n    struct list *next;\n};\n\ntypedef struct list node;\ntypedef node *link;\n\nlink delete_node(link pointer, link tmp){\n    // 删除第一个节点\n    if(tmp == NULL){\n        return pointer->next;\n    }else{\n        // 删除最后一个节点\n        if(tmp->next->next == NULL){\n            tmp->next =NULL;\n        }else{\n            tmp->next = tmp->next->next;\n        }\n    return pointer;\n    }\n}\n\nvoid selection_sort(link pointer, int num){\n    link tmp, btmp;\n    int i, min;\n\n    for(i=0; i<num; i++){\n        tmp = pointer;\n        min = tmp->data;\n        btmp = NULL;\n\n        while(tmp->next){\n            if(min > tmp->next->data){\n                min = tmp->next->data;\n                btmp = tmp;\n            }\n            tmp = tmp->next;\n        }\n        printf("\\40: %d\\n", min);\n        pointer = delete_node(pointer, btmp);\n    }\n}\n\nlink craete_list(int array[], int num){\n    link tmp1, tmp2, pointer;\n    int i;\n    pointer = (link)malloc(sizeof(node));\n    pointer->data = array[0];\n    tmp1 = pointer;\n    for(i=1; i<num; i++){\n        tmp2 = (link)malloc(sizeof(node));\n        tmp2->next = NULL;\n        tmp2->data = array[i];\n        tmp1->next = tmp2;\n        tmp1 = tmp1->next;\n    }\n    return pointer;\n}\n\nlink concatenate(link pointer1, link pointer2){\n    link tmp;\n    tmp = pointer1;\n    while(tmp->next){\n        tmp = tmp->next;\n    }\n    tmp->next = pointer2;\n    return pointer1;\n}\n\nint main(void){\n    int arr1[] = {3, 12, 8, 9, 11};\n    link ptr;\n    ptr = create_list(arr1, 5);\n    selection_sort(ptr, 5);\n}',
        fileName: 'ex74.c'
      }
    ]
  },
  {
    id: 75,
    title: '输入一个整数，并将其反转后输出',
    description: '',
    solutions: [
      {
        label: '',
        approach: '- 处理负数，记录符号，转换为正数处理;\n- 循环去除原数的每一位\n    - 通过取模取得最后一位数字;\n    - 通过整数除法去掉最后一位数字;\n- 构建反转后的数字\n    - 每次将结果乘以10，再加上当前位数字;\n- 处理反转后的符号;\n- 处理整数溢出问题',
        code: '#include <stdio.h>\n\nint reverse_integer(int num){\n    int reversed = 0;\n    int sign = 1;\n\n    // 处理负数\n    if(num < 0){\n        sign = -1;\n        num = -num; // 转换为正数\n    }\n\n    // 反转数字\n    while(num > 0){\n        int digit = num % 10; // 取出最后一位数字\n        reversed = reversed * 10 + digit; // 构建反转后的数字\n        num = num /10; // 去掉最后一位数字\n    }\n\n    return sign * reversed;\n}\n\nint main(){\n    int num;\n\n    printf("请输入一个整数：");\n    scanf("%d", &num);\n\n    int reversed = reverse_integer(num);\n\n    printf("原整数为：%d\\n", num);\n    printf("反转后的整数为：%d\\n", reversed);\n\n    return 0;\n}',
        fileName: 'ex75.c'
      }
    ]
  },
  {
    id: 76,
    title: '编写一个函数，',
    description: '输入n为偶数时，调用函数求1/2+1/4+...+1/n,\n当输入n为奇数时，调用函数1/1+1/3+...+1/n(利用指针函数)。',
    solutions: [
      {
        label: '',
        approach: '- 定义两个函数分奇偶数;\n- 使用指针根据n的奇偶性指向不同函数;\n- 调用函数指向相应的计算函数',
        code: '#include <stdio.h>\n\ndouble sum_even(int n); // 计算偶数序列和\ndouble sum_odd(int n); // 计算奇数序列和\n\nint main(){\n    int n;\n\n    printf("请输入一个正整数n ：");\n    scanf("%d", &n);\n\n    if(n <= 0){\n        printf("错误！请输入一个正整数！\\n");\n        return 1;\n    }\n\n    // 定义函数指针\n    double (*sum_func)(int);\n\n    // 根据n的奇偶性指向不同函数\n    if(n%2 == 0){\n        printf("n为偶数，计算：1/2 + 1/4 + ... + 1/n\\n");\n        sum_func = sum_even; // 指向偶数序列和函数\n    }else{\n        printf("n为奇数，计算：1/1 + 1/3 + ... + 1/n\\n");\n        sum_func = sum_odd; // 指向奇数序列和函数\n    }\n    \n    // 调用函数\n    double result = sum_func(n);\n\n    printf("结果为：%.6f\\n", result);\n\n    return 0;\n}\n\n// 定义偶数序列和函数\ndouble sum_even(int n){\n    double sum = 0.0;\n\n    for(int i=2; i<=n; i+=2){\n        sum = sum + 1.0/i;\n    }\n\n    return sum;\n}\n\n// 定义奇数序列和函数\ndouble sum_odd(int n){\n    double sum = 0.0;\n\n    for(int i=1; i<=n; i+=2){\n        sum = sum + 1.0/i;\n    }\n\n    return sum;\n}',
        fileName: 'ex76.c'
      }
    ]
  },
  {
    id: 77,
    title: '练习指向指针的指针（使用多级指针遍历字符串数组）',
    description: '',
    solutions: [
      {
        label: '',
        approach: '',
        code: '#include <stdio.h>\n#include <stdlib.h>\n\nint main(){\n    // 定义一个字符指针数组，存储字符串常量\n    const char *s[] = {"man", "woman", "girl", "boy", "sister"};\n\n    // 定义一个指向字符指针的指针变量\n    const char **q;\n\n    int k;\n\n    // 遍历数组，并通过指向指针的指针输出每个字符串\n    for(k=0; k<5; k++){\n        q = &s[k]; // 让指针q指向字符指针数组中第k歌元素的地址\n        printf("%s\\n", *q); // 解引用去，输出对应的字符串\n    }\n\n    return 0;\n}',
        fileName: 'ex77.c'
      }
    ]
  },
  {
    id: 78,
    title: '找到年龄最大的人，并输出',
    description: '',
    solutions: [
      {
        label: '',
        approach: '',
        code: '#include <stdio.h>\n#include <stdlib.h>\n\n// 定义结构体类型，用于存储人员的姓名和年龄\nstruct man{\n    char name[20];\n    int age;\n}person[3] = {{"li", 18}, {"wang", 25}, {"sun", 22}}; // 初始化数组\n\nint main(){\n    struct man *q = NULL; // 用于指向年龄最大的人\n    struct man *p = person; // 指向数组的起始地址\n\n    int i;\n    int max_age = 0; // 存储最大年龄\n\n    // 遍历数组，找到年龄最大的人\n    for(i=0; i<3; i++){\n        // 如果当前年龄大于max_age\n        if(p->age > max_age){\n            max_age = p->age; // 更新max_age\n            q = p; // 将q指向当前人员\n        }\n        p++; // 指向下一个人员\n    }\n\n    // 输出年龄最大的人的姓名和年龄\n    if(q != NULL){\n        printf("年龄最大的人是：%s，年龄是：%d\\n", q->name, q->age);\n    }else{\n        printf("没有找到人员信息。\\n");\n    }\n\n    return 0;\n}',
        fileName: 'ex78.c'
      }
    ]
  },
  {
    id: 79,
    title: '字符串排序',
    description: '',
    solutions: [
      {
        label: '',
        approach: '',
        code: '#include <stdio.h>\n#include <string.h>\n#include <stdlib.h>\n\n#define MAX_LEN 20 //定义常量表示字符串的最大长度\n\n// 函数声明，用于交换两个字符串\nvoid swap(char *str1, char *str2);\n\nint main(){\n    char str1[MAX_LEN], str2[MAX_LEN], str3[MAX_LEN];\n\n    // 提示用户输入字符串\n    printf("请输入3个字符串，每个字符串以回车结束：\\n");\n\n    // 使用fgets读取输入并去除换行符\n    fgets(str1, sizeof(str1), stdin);\n    str1[strcspn(str1, "\\n")] = \'\\0\'; // 去除换行符\n\n    fgets(str2, sizeof(str2), stdin);\n    str2[strcspn(str2, "\\n")] = \'\\0\';  // 去除换行符\n\n    fgets(str3, sizeof(str3), stdin);\n    str3[strcspn(str3, "\\n")] = \'\\0\';  // 去除换行符\n\n    // 对字符串进行排序\n    if(strcmp(str1, str2) > 0) swap(str1, str2);\n    if(strcmp(str1, str3) > 0) swap(str1, str3);\n    if(strcmp(str2, str3) > 0) swap(str2, str3);\n\n    // 输出排序后的结果\n    printf("排序后的结果为：\\n");\n    printf("%s\\n%s\\n%s\\n", str1, str2, str3);\n\n    return 0;\n}\n\n// 交换两个字符串的内容\nvoid swap(char *str1, char *str2){\n    char temp[MAX_LEN];\n    strcpy(temp, str1); // 将str1复制到临时字符串temp\n    strcpy(str1, str2); // 将str2复制到str1\n    strcpy(str2, temp); // 将temp复制到str2\n}',
        fileName: 'ex79.c'
      }
    ]
  },
  {
    id: 80,
    title: '海滩上有一堆桃子，五只猴子来分',
    description: '第一只猴子把这堆桃子平均分为五份，多了一个，这只猴子把多的一个扔入海中，拿走了一份。\n第二只猴子把剩下的桃子又平均分成五份，又多了一个，它同样把多的一个扔入海中，拿走了一份，\n第三、第四、第五只猴子都是这样做的，\n问海滩上原来最少有多少个桃子？',
    solutions: [
      {
        label: '',
        approach: '每个猴子的操作是一样的，每次操作前后桃子数的关系是一样的\n    - 当前桃子数 = 4/5 * (前一次的桃子数 - 1)\n    - 前一次的桃子数 = 5/4 * 当前桃子数 + 1\n使用倒推法来求解，先确定最终剩余的桃子数，从最小的1开始枚举;\n根据条件，需要满足：\n    - 每一次的桃子数都为整数;\n    - 每一次的桃子数都应是4的倍数;\n    - 每一次的桃子数都应可以分成五份还多一个;',
        code: '#include <stdio.h>\n\nint main(){\n    int peaches; // 桃子数\n    int current; // 当前桃子数\n    int found = 0; // 判断是否找到了最少的最后剩下的桃子数\n\n    // 从1开始枚举最后剩下的桃子数\n    for(peaches=1; peaches<=100000; peaches++){\n        current = peaches; // 当前桃子数\n        int valid = 1; // 判断当前桃子数是否有效\n\n        // 倒推5次判断\n        for(int i=5; i>0; i--){\n            // 倒推公式：前一次的桃子数 = 5/4 * 当前桃子数 + 1\n            // 保证每一次都是整数\n            if(current % 4 != 0){\n                valid = 0;\n                break;\n            }\n\n            // 倒推计算\n            current = current * 5 / 4 + 1;\n\n            // 保证每一次都可以分成五份还多一个\n            if(current % 5 != 1){\n                valid = 0;\n                break;\n            }\n        }\n\n        if(valid == 1){\n            found = 1;\n            printf("最初的桃子数最少为：%d\\n", current);\n            break;\n        }\n    }\n\n    printf("\\n");\n\n    if(found == 1){\n        peaches = current;\n        \n        // 计算总共有多少个桃子\n        for(int i=1; i<=5; i++){\n            printf("第%d只猴子：", i);\n            printf("开始有%d个桃子，", peaches);\n            // 正向计算公式：当前桃子数 = 4/5 * (前一次的桃子数 - 1)\n            peaches = (peaches - 1) * 4 / 5;\n            printf("分完扔完拿完后还剩%d个桃子。\\n", peaches);\n        }\n\n        printf("\\n");\n        printf("最终最少剩%d个桃子", peaches);\n    }\n\n    return 0;\n}',
        fileName: 'ex80.c'
      }
    ]
  }
];
