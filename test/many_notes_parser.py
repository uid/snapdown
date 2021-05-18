import csv
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from statistics import median
import numpy as np
from matplotlib.ticker import PercentFormatter
from scipy.stats import f_oneway

omni_data = list(csv.reader(open("many_notes.csv")))

correct_submits_sp20 = []
num_attempts_sp20 = []
correct_submits_fa20 = []
num_attempts_fa20 = []

for row in omni_data:
	if "/classes" in row[0]:
		continue

	if row[1]:
		submits_sp20 = row[1].split(',')
		cur_time = 0
		for i in range(len(submits_sp20)):
			cur_time += float(submits_sp20[i])
			if row[0][i] == 'T':
				correct_submits_sp20.append(cur_time)
				num_attempts_sp20.append(i + 1)
				break

	if row[3]:
		submits_fa20 = row[3].split(',')
		cur_time = 0
		for i in range(len(submits_fa20)):
			cur_time += float(submits_fa20[i])
			if row[2][i] == 'T':
				correct_submits_fa20.append(cur_time)
				num_attempts_fa20.append(i + 1)
				break


min_sp20 = min(correct_submits_sp20)
correct_submits_sp20 = [x - min_sp20 for x in correct_submits_sp20]

min_fa20 = min(correct_submits_fa20)
correct_submits_fa20 = [x - min_fa20 for x in correct_submits_fa20]

# plt.plot(correct_submits_sp20, num_attempts_sp20, 'bo')
# plt.plot(correct_submits_fa20, num_attempts_fa20, 'ro')

# blue_patch = mpatches.Patch(color='blue', label=f'sp20 (avg {str(round(sum(num_attempts_sp20)/len(num_attempts_sp20), 2))}, med {median(num_attempts_sp20)} attempts)')
# red_patch = mpatches.Patch(color='red', label=f'fa20 (avg {str(round(sum(num_attempts_fa20)/len(num_attempts_fa20), 2))}, med {median(num_attempts_fa20)} attempts)')
# plt.legend(handles=[blue_patch, red_patch])
# plt.show()

stat, p = f_oneway(num_attempts_sp20, num_attempts_fa20)
print(p)



sp20_label = f'sp20 (avg {str(round(sum(num_attempts_sp20)/len(num_attempts_sp20), 2))}, med {median(num_attempts_sp20)} attempts)'
fa20_label = f'fa20 (avg {str(round(sum(num_attempts_fa20)/len(num_attempts_fa20), 2))}, med {median(num_attempts_fa20)} attempts)'

plt.title('manyNotes - Spring 2020 vs. Fall 2020 Attempts')
plt.hist([num_attempts_sp20, num_attempts_fa20], 10, label=[sp20_label, fa20_label], weights=[np.ones(len(num_attempts_sp20)) / len(num_attempts_sp20), np.ones(len(num_attempts_fa20)) / len(num_attempts_fa20)])
plt.gca().yaxis.set_major_formatter(PercentFormatter(1))
plt.legend()
plt.ylabel('Percentage of students')
plt.xlabel('Number of attempts')
plt.show()

