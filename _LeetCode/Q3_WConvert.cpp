#include <iostream>
using namespace std;

// Q: The string "PAYPALISHIRING" is written in a zigzag pattern on a given number of rows like this: (you may want to display this pattern in a fixed font for better legibility)

// Example:
//		P   A   H   N
//		A P L S I I G
//		Y   I   R
// And then read line by line : "PAHNAPLSIIGYIR"

string convert(string s, int row) {
	if (row == 1) return s;
	int len = s.length(), fj = (row-1) * 2, sj = 0; // fj <= firstJump, sj <= secondJump
	string re = "";

	for (int i = 0; i < row; i++) {
		int id = i; // id <= pack index
		if (i < len) re += s[i];
		while (1) {
			//jump
			if (fj != 0)
				if (id + fj < len)
					re += s[id += fj]; //take
				else break;
			//jump
			if (sj != 0)
				if (id + sj < len)
					re += s[id += sj]; //take 
				else break;
		}
		fj -= 2;
		sj += 2;
	}
	
	return re;
}

int main() {
	// 1 <= s.length <= 1000, s consists of English letters(lower - case, upper - case, ',' and '.').
	string str1 = "PAHNAPLSIIGYIR", str2 = "A"; 
	// 1 <= numRows <= 1000
	int row1 = 3, row2 = 1; 
	cout << convert(str1, row1) << endl;
	cout << convert(str2, row2) << endl;
	return 0;
}